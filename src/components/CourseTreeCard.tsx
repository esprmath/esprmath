'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FALLBACK_MODULES, windowStatus, type CourseModule } from '@/lib/courseAccess';
import styles from './CourseTreeCard.module.css';

/**
 * كرت «كورسك الحالي»: زر الشجرة يقلب الكرت ويطلع تشجير الكورس (المودلات وتحت كل مودل شابتراته)،
 * والضغط على أي مودل أو شابتر يفتحه مباشرة. الوجه الخلفي بنفس حجم الكرت، وللشاشات الكبيرة فقط.
 */

type ModuleRow = Pick<CourseModule, 'module_number' | 'title' | 'chapters' | 'is_open' | 'is_free' | 'opens_at' | 'closes_at'>;

// نفس النسخة المحفوظة اللي تكتبها صفحة الكورس (CourseHub)، عشان يطلع التشجير فورًا
function readCachedModules(courseId: string): ModuleRow[] | null {
    try {
        const cached = JSON.parse(localStorage.getItem(`course_hub_${courseId}`) ?? 'null');
        return Array.isArray(cached?.modules) ? cached.modules : null;
    } catch {
        return null;
    }
}

interface Props {
    courseId: string;
    courseTitle: string;
    isApproved: boolean;
    /** شكل الكرت نفسه (الإطار والخلفية)، ينطبق على الوجهين */
    cardStyle: CSSProperties;
    /** محتوى الوجه الأمامي، ويستلم زر الشجرة عشان يحطه في رأس الكرت */
    children: (treeButton: ReactNode) => ReactNode;
}

export default function CourseTreeCard({ courseId, courseTitle, isApproved, cardStyle, children }: Props) {
    const [flipped, setFlipped] = useState(false);
    const [modules, setModules] = useState<ModuleRow[] | null>(null);

    const loadModules = async () => {
        const cached = readCachedModules(courseId);
        if (cached) setModules(cached);
        const { data, error } = await supabase
            .from('course_modules')
            .select('module_number, title, chapters, is_open, is_free, opens_at, closes_at')
            .eq('course_id', courseId)
            .order('module_number');
        if (!error && data) setModules(data);
        else if (!cached) setModules(FALLBACK_MODULES[courseId]?.map((m) => ({ ...m, opens_at: null, closes_at: null })) ?? []);
    };

    const toggle = () => {
        if (!flipped && modules === null) loadModules();
        setFlipped(!flipped);
    };

    const remember = (moduleNumber: number) => {
        try {
            localStorage.setItem(`last_module_${courseId}`, String(moduleNumber));
        } catch {
            // التخزين معطل: يفتح عادي بدون «آخر ما ذاكرته»
        }
    };

    const treeButton = (
        <button type="button" className={styles.treeBtn} onClick={toggle} aria-label="تشجير الكورس" title="تشجير الكورس">
            <TreeIcon />
        </button>
    );

    return (
        <div className={styles.scene}>
            <div className={`${styles.flip} ${flipped ? styles.flipped : ''}`}>
                <div className={styles.front} style={cardStyle} aria-hidden={flipped}>
                    {children(treeButton)}
                </div>

                <div className={styles.back} style={cardStyle} aria-hidden={!flipped}>
                    <button
                        type="button"
                        className={`${styles.treeBtn} ${styles.backBtn}`}
                        onClick={toggle}
                        aria-label="رجوع للكرت"
                        title="رجوع"
                        tabIndex={flipped ? 0 : -1}
                    >
                        ↩
                    </button>

                    {modules === null ? (
                        <p className={styles.note}>جاري تحميل التشجير... ⏳</p>
                    ) : modules.length === 0 ? (
                        <p className={styles.note}>ما فيه Modules منشورة للحين.</p>
                    ) : (
                        <Tree
                            active={flipped}
                            courseId={courseId}
                            courseTitle={courseTitle}
                            modules={modules}
                            isApproved={isApproved}
                            tabIndex={flipped ? 0 : -1}
                            onOpen={remember}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/** رقم شبه عشوائي ثابت (بين -1 و 1) حسب المكان، عشان الشجرة تطلع غير مرتبة بس ما تتحرك كل ما ترسم */
function jitter(seed: number): number {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
}

// مستويات الشجرة كنسبة من ارتفاع الكرت: اسم الكورس فوق، ثم المودلات، ثم الشابترات على مستويين متداخلين
const ROOT_Y = 11;
const MODULE_Y = 42;
const CHAPTER_Y = [70, 88];

// أنصاف ارتفاعات العقد بالبكسل (تقريبًا من CSS)، عشان الفروع تطلع من تحت العقدة وتدخل من فوق اللي بعدها
const HALF_H = { root: 14, module: 12, chapter: 10 };
// طول الساق القصيرة تحت العقدة قبل ما تتفرع، وعندها عقدة صغيرة
const STEM = 7;

interface TreeProps {
    /** الكرت مقلوب: الفروع ترسم نفسها من فوق لتحت */
    active: boolean;
    courseId: string;
    courseTitle: string;
    modules: ModuleRow[];
    isApproved: boolean;
    tabIndex: number;
    onOpen: (moduleNumber: number) => void;
}

/**
 * تشجير من فوق لتحت: كل مودل له عمود، وشابتراته تحته متفرقة على ارتفاعات مختلفة.
 * الفروع خطوط منحنية بـ SVG بنفس نسب المواقع، فالشجرة تتمدد مع عرض الكرت بدون سكرول.
 */
function Tree({ active, courseId, courseTitle, modules, isApproved, tabIndex, onOpen }: TreeProps) {
    const columnWidth = 100 / modules.length;

    // الفروع ترسم بالبكسل الحقيقي (مو بالنسب) عشان المنحنيات وسماكة الخط ثابتة مع أي عرض
    const boxRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const nodes = modules.map((mod, m) => {
        const isAvailable = windowStatus(mod) === 'open';
        const isOpen = isAvailable && (mod.is_free || isApproved);
        // الاتجاه من اليمين: Module 1 أقصى اليمين
        const columnRight = 100 - m * columnWidth;
        const x = columnRight - columnWidth / 2 + jitter(mod.module_number) * columnWidth * 0.08;
        const y = MODULE_Y + jitter(mod.module_number * 7) * 6;
        const count = mod.chapters.length;
        // هامش داخل العمود عشان شابترات المودلات المتجاورة ما تلتصق ببعض
        const inset = columnWidth * 0.1;
        const span = columnWidth - inset * 2;
        const chapters = mod.chapters.map((chapter, c) => ({
            chapter,
            x: columnRight - inset - ((c + 0.5) * span) / count + jitter(m * 31 + c) * Math.min(1.5, span / count / 6),
            // المستويين بالتناوب، وإذا الشابتر وحيد ينزل للمستوى الأول
            y: (count === 1 ? CHAPTER_Y[0] : CHAPTER_Y[c % 2]) + jitter(m * 17 + c * 3) * 3,
        }));
        return { mod, isOpen, isAvailable, x, y, chapters };
    });

    const px = (x: number) => (x / 100) * size.w;
    const py = (y: number) => (y / 100) * size.h;
    // فرع على شكل قوس ربع: يطلع من العقدة للجنب وينزل عمودي لأعلى الابن، مثل غصن الشجرة
    const branch = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} Q${x2} ${y1} ${x2} ${y2}`;
    const rootX = px(50);
    const rootKnot = py(ROOT_Y) + HALF_H.root + STEM;

    return (
        <div ref={boxRef} className={`${styles.tree} ${active ? styles.growing : ''}`}>
            {size.w > 0 && (
                <svg className={styles.branches} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
                    {/* الجذع: من اسم الكورس للمودلات */}
                    <path className={styles.stem} pathLength={1} d={`M${rootX} ${py(ROOT_Y) + HALF_H.root - 2} V${rootKnot}`} />
                    {nodes.map((node) => {
                        const mx = px(node.x);
                        const myTop = py(node.y) - HALF_H.module;
                        const knot = py(node.y) + HALF_H.module + STEM;
                        return (
                            <g key={node.mod.module_number} className={node.isOpen ? undefined : styles.branchLocked}>
                                <path className={styles.trunk} pathLength={1} d={branch(rootX, rootKnot, mx, myTop)} />
                                {node.chapters.length > 0 && (
                                    <>
                                        <path className={styles.twigStem} pathLength={1} d={`M${mx} ${py(node.y) + HALF_H.module - 2} V${knot}`} />
                                        {node.chapters.map((ch) => (
                                            <path
                                                key={ch.chapter}
                                                className={styles.twig}
                                                pathLength={1}
                                                d={branch(mx, knot, px(ch.x), py(ch.y) - HALF_H.chapter)}
                                            />
                                        ))}
                                        <circle className={styles.knot} cx={mx} cy={knot} r={3} />
                                    </>
                                )}
                            </g>
                        );
                    })}
                    <circle className={`${styles.knot} ${styles.rootKnot}`} cx={rootX} cy={rootKnot} r={4} />
                </svg>
            )}

            <span className={styles.root} style={{ left: '50%', top: `${ROOT_Y}%` }}>
                {courseTitle}
            </span>

            {nodes.map(({ mod, isOpen, isAvailable, x, y, chapters }) => {
                const modulePath = `/workspace/${courseId}/${mod.module_number}`;
                const label = `Module ${mod.module_number}`;
                const name = mod.title.replace(/^Module\s*\d+\s*[-:–]\s*/i, '');
                const pos = (px: number, py: number) => ({ left: `${px}%`, top: `${py}%` });

                return (
                    <div key={mod.module_number} className={styles.group}>
                        {isOpen ? (
                            <Link
                                href={modulePath}
                                className={styles.module}
                                style={pos(x, y)}
                                title={name}
                                onClick={() => onOpen(mod.module_number)}
                                tabIndex={tabIndex}
                            >
                                {label}
                            </Link>
                        ) : (
                            <span className={`${styles.module} ${styles.locked}`} style={pos(x, y)} title={isAvailable ? name : 'قريبًا'}>
                                🔒 {label}
                            </span>
                        )}

                        {chapters.map((ch) =>
                            isOpen ? (
                                <Link
                                    key={ch.chapter}
                                    href={`${modulePath}?chapter=${ch.chapter}`}
                                    className={styles.chip}
                                    style={pos(ch.x, ch.y)}
                                    onClick={() => onOpen(mod.module_number)}
                                    tabIndex={tabIndex}
                                >
                                    {ch.chapter}
                                </Link>
                            ) : (
                                <span key={ch.chapter} className={`${styles.chip} ${styles.locked}`} style={pos(ch.x, ch.y)}>
                                    {ch.chapter}
                                </span>
                            )
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function TreeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="3" width="6" height="5" rx="1" />
            <rect x="3" y="16" width="6" height="5" rx="1" />
            <rect x="15" y="16" width="6" height="5" rx="1" />
            <path d="M12 8v4M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        </svg>
    );
}
