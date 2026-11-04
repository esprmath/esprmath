'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import GlobalTutor from '@/components/GlobalTutor';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './FullScreenCanvasModal.module.css';

interface Point { x: number; y: number }

/** عنصر في سجل اللوح: خط مرسوم، أو "مسح الكل" حتى يمكن التراجع عنه */
type BoardAction =
    | { type: 'stroke'; color: string; size: number; eraser: boolean; points: Point[] }
    | { type: 'clear' };

const COLORS = [
    { value: '#2c3531', name: 'أسود' },
    { value: '#8c5521', name: 'بني' },
    { value: '#b91c1c', name: 'أحمر' },
    { value: '#1d4ed8', name: 'أزرق' },
];
const SIZES = [
    { value: 2, name: 'رفيع', dot: 4 },
    { value: 4, name: 'متوسط', dot: 7 },
    { value: 7, name: 'عريض', dot: 11 },
];
const ERASER_SIZE = 26;
const SAVE_MINUTES = 7;

const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** يرسم الجزء رقم i من الخط بمنحنى ناعم */
function drawSegment(ctx: CanvasRenderingContext2D, stroke: Extract<BoardAction, { type: 'stroke' }>, i: number) {
    const { points, color, size, eraser } = stroke;
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = eraser ? 'rgba(0,0,0,1)' : color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const current = points[i];
    ctx.beginPath();
    if (i === 0) {
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(current.x, current.y);
    } else {
        const previous = points[i - 1];
        const start = i >= 2 ? mid(points[i - 2], previous) : previous;
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(previous.x, previous.y, (previous.x + current.x) / 2, (previous.y + current.y) / 2);
    }
    ctx.stroke();
}

interface FullScreenCanvasModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionImage?: string;
    mathText?: string;
    modalStorageKey: string;
    activeChapter: string;
    activeIdeaMeta?: { id: string; name: string };
    courseId?: string;
    currentQuestion?: string;
    isAiAllowed?: boolean;
    chatKey?: string;
    ideaNotes?: string;
}

export default function FullScreenCanvasModal({
    isOpen,
    onClose,
    questionImage,
    mathText,
    modalStorageKey,
    activeChapter,
    activeIdeaMeta,
    courseId,
    currentQuestion,
    isAiAllowed,
    chatKey,
    ideaNotes
}: FullScreenCanvasModalProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const boardRef = useRef<HTMLDivElement | null>(null);
    const actionsRef = useRef<BoardAction[]>([]);
    const redoRef = useRef<BoardAction[]>([]);
    const activePointerRef = useRef<number | null>(null);

    const [color, setColor] = useState(COLORS[0].value);
    const [size, setSize] = useState(SIZES[1].value);
    const [isEraser, setIsEraser] = useState(false);
    const [showGraph, setShowGraph] = useState(true);
    const [, setHistoryVersion] = useState(0); // لتحديث أزرار التراجع والإعادة

    const storageKey = `${modalStorageKey}_board`;
    const timeKey = `${modalStorageKey}_board_time`;

    const redrawAll = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // نبدأ من بعد آخر "مسح الكل"
        const actions = actionsRef.current;
        const start = actions.map((a) => a.type).lastIndexOf('clear') + 1;
        actions.slice(start).forEach((action) => {
            if (action.type === 'stroke') action.points.forEach((_, i) => drawSegment(ctx, action, i));
        });
    }, []);

    const saveBoard = useCallback(() => {
        try {
            if (actionsRef.current.length === 0) {
                sessionStorage.removeItem(storageKey);
                sessionStorage.removeItem(timeKey);
                return;
            }
            sessionStorage.setItem(storageKey, JSON.stringify(actionsRef.current));
            sessionStorage.setItem(timeKey, Date.now().toString());
        } catch {
            // إذا امتلأت مساحة المتصفح يبقى الرسم ظاهرًا، لكنه لا يُحفظ
        }
    }, [storageKey, timeKey]);

    const afterHistoryChange = useCallback(() => {
        redrawAll();
        saveBoard();
        setHistoryVersion((v) => v + 1);
    }, [redrawAll, saveBoard]);

    const undo = useCallback(() => {
        const action = actionsRef.current.pop();
        if (!action) return;
        redoRef.current.push(action);
        afterHistoryChange();
    }, [afterHistoryChange]);

    const redo = useCallback(() => {
        const action = redoRef.current.pop();
        if (!action) return;
        actionsRef.current.push(action);
        afterHistoryChange();
    }, [afterHistoryChange]);

    // تحميل الرسم المحفوظ لهذا السؤال، وضبط دقة اللوح حسب حجمه الفعلي حتى لا تتمدد الخطوط
    useEffect(() => {
        if (!isOpen) return;

        let saved: BoardAction[] = [];
        try {
            const savedTime = Number(sessionStorage.getItem(timeKey));
            const savedBoard = sessionStorage.getItem(storageKey);
            if (savedBoard && savedTime && Date.now() - savedTime < SAVE_MINUTES * 60 * 1000) {
                saved = JSON.parse(savedBoard);
            } else {
                sessionStorage.removeItem(storageKey);
                sessionStorage.removeItem(timeKey);
            }
        } catch {
            saved = [];
        }
        actionsRef.current = saved;
        redoRef.current = [];
        activePointerRef.current = null;
        setHistoryVersion((v) => v + 1);

        const board = boardRef.current;
        const canvas = canvasRef.current;
        if (!board || !canvas) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(board.clientWidth * dpr);
            canvas.height = Math.round(board.clientHeight * dpr);
            redrawAll();
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(board);
        return () => observer.disconnect();
    }, [isOpen, storageKey, timeKey, redrawAll]);

    // منع سكرول الصفحة خلف اللوح، واختصارات التراجع والإعادة
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const key = e.key.toLowerCase();
            if (key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, undo, redo]);

    if (!isOpen) return null;

    const toBoardPoint = (e: { clientX: number; clientY: number }): Point => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) * 10) / 10,
            y: Math.round((e.clientY - rect.top) * 10) / 10,
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        // إصبع واحد فقط يرسم، حتى لا تترك راحة اليد خطوطًا
        if (activePointerRef.current !== null || e.button !== 0) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        activePointerRef.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);

        const stroke: BoardAction = {
            type: 'stroke',
            color,
            size: isEraser ? ERASER_SIZE : size,
            eraser: isEraser,
            points: [toBoardPoint(e)],
        };
        actionsRef.current.push(stroke);
        redoRef.current = [];
        drawSegment(ctx, stroke, 0);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (e.pointerId !== activePointerRef.current) return;
        const ctx = canvasRef.current?.getContext('2d');
        const stroke = actionsRef.current[actionsRef.current.length - 1];
        if (!ctx || stroke?.type !== 'stroke') return;

        // الأقلام الرقمية ترسل نقاطًا أكثر من حركة المؤشر، فنأخذها كلها لخط أنعم
        const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
        (events.length > 0 ? events : [e.nativeEvent]).forEach((event) => {
            stroke.points.push(toBoardPoint(event));
            drawSegment(ctx, stroke, stroke.points.length - 1);
        });
    };

    const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (e.pointerId !== activePointerRef.current) return;
        activePointerRef.current = null;
        saveBoard();
        setHistoryVersion((v) => v + 1);
    };

    const clearBoard = () => {
        const actions = actionsRef.current;
        if (actions.length === 0 || actions[actions.length - 1].type === 'clear') return;
        actions.push({ type: 'clear' });
        redoRef.current = [];
        afterHistoryChange();
    };

    const hasDrawing = (() => {
        const last = actionsRef.current[actionsRef.current.length - 1];
        return Boolean(last) && last.type !== 'clear';
    })();

    return (
        <div className={styles.page}>
            <GlobalTutor
                courseId={courseId}
                currentChapter={activeChapter}
                currentIdea={activeIdeaMeta}
                currentQuestion={currentQuestion}
                isAiAllowed={isAiAllowed}
                chatKey={chatKey}
                ideaNotes={ideaNotes}
            />

            <div className={styles.toolbar}>
                <div className={styles.heading}>
                    <span className={styles.title}>✍️ ورقة الحل</span>
                    <span className={styles.subtitle}>رسمك محفوظ لمدة {SAVE_MINUTES} دقائق</span>
                </div>

                <div className={styles.tools}>
                    <div className={styles.group}>
                        <button
                            type="button"
                            title="قلم"
                            aria-pressed={!isEraser}
                            onClick={() => setIsEraser(false)}
                            className={`${styles.toolBtn} ${!isEraser ? styles.toolBtnActive : ''}`}
                        >
                            <span className={styles.toolIcon}>✏️</span>
                        </button>
                        <button
                            type="button"
                            title="مساحة"
                            aria-pressed={isEraser}
                            onClick={() => setIsEraser(true)}
                            className={`${styles.toolBtn} ${isEraser ? styles.toolBtnActive : ''}`}
                        >
                            <span className={styles.toolIcon}>🧽</span>
                        </button>
                    </div>

                    <div className={styles.group}>
                        {COLORS.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                title={c.name}
                                aria-label={`لون ${c.name}`}
                                aria-pressed={!isEraser && color === c.value}
                                onClick={() => { setColor(c.value); setIsEraser(false); }}
                                className={`${styles.swatch} ${!isEraser && color === c.value ? styles.swatchActive : ''}`}
                                style={{ background: c.value }}
                            />
                        ))}
                    </div>

                    <div className={styles.group}>
                        {SIZES.map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                title={s.name}
                                aria-label={`خط ${s.name}`}
                                aria-pressed={size === s.value}
                                onClick={() => { setSize(s.value); setIsEraser(false); }}
                                className={`${styles.toolBtn} ${!isEraser && size === s.value ? styles.toolBtnActive : ''}`}
                            >
                                <span className={styles.sizeDot} style={{ width: s.dot, height: s.dot }} />
                            </button>
                        ))}
                    </div>

                    <div className={styles.group}>
                        <button type="button" title="تراجع (Ctrl+Z)" aria-label="تراجع" onClick={undo} disabled={actionsRef.current.length === 0} className={styles.toolBtn}>
                            <span className={styles.toolIcon}>↩</span>
                        </button>
                        <button type="button" title="إعادة (Ctrl+Y)" aria-label="إعادة" onClick={redo} disabled={redoRef.current.length === 0} className={styles.toolBtn}>
                            <span className={styles.toolIcon}>↪</span>
                        </button>
                        <button type="button" title="مسح اللوح (يمكن التراجع عنه)" aria-label="مسح اللوح" onClick={clearBoard} disabled={!hasDrawing} className={styles.toolBtn}>
                            <span className={styles.toolIcon}>🗑️</span>
                            <span className={styles.clearLabel}>مسح</span>
                        </button>
                    </div>

                    {questionImage && (
                        <div className={styles.group}>
                            <button
                                type="button"
                                title={showGraph ? 'إخفاء الرسم البياني' : 'إظهار الرسم البياني'}
                                aria-pressed={showGraph}
                                onClick={() => setShowGraph(!showGraph)}
                                className={`${styles.toolBtn} ${showGraph ? styles.toolBtnActive : ''}`}
                            >
                                <span className={styles.toolIcon}>📈</span>
                            </button>
                        </div>
                    )}
                </div>

                <button type="button" onClick={onClose} className={styles.closeBtn}>
                    رجوع للسؤال ←
                </button>
            </div>

            <div className={styles.workspace}>
                {mathText && (
                    <div className={styles.question}>
                        <span className={styles.questionLabel}>السؤال:</span>
                        <div className={styles.questionMath}>
                            {mathText.includes('\\') ? <BlockMath math={mathText} /> : mathText}
                        </div>
                    </div>
                )}

                <div className={styles.board} ref={boardRef}>
                    {questionImage && showGraph && (
                        <div className={styles.graph}>
                            <img src={questionImage} alt="الرسم البياني للسؤال" />
                        </div>
                    )}
                    <canvas
                        ref={canvasRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerEnd}
                        onPointerCancel={handlePointerEnd}
                        className={`${styles.canvas} ${isEraser ? styles.canvasErasing : ''}`}
                    />
                </div>
            </div>
        </div>
    );
}
