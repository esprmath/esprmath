'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

const TIME_TABLE: Array<{ activity: string; time: string }> = [
    { activity: 'قراءة صفحة من كتاب المقرر', time: '5–7 دقائق (10–15 إذا كانت رياضيات أو رسوم)' },
    { activity: 'حل سؤال في واجب أو كويز', time: '1–3 دقائق (15 دقيقة للمسائل الصعبة)' },
    { activity: 'كتابة صفحة في تقرير أو بحث', time: 'ساعة إلى ساعة ونصف تقريبًا' },
    { activity: 'مذاكرة كويز (فصل واحد)', time: 'من 45 إلى 90 دقيقة' },
    { activity: 'مذاكرة ميد أو فاينل', time: 'من ساعة إلى ساعتين لكل مرة مذاكرة' },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className={styles.futBlock}>
            <h3 className={styles.futBlockTitle}>{title}</h3>
            {children}
        </section>
    );
}

function Points({ items }: { items: string[] }) {
    return (
        <ul className={styles.futList}>
            {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
    );
}

function TimeManagementSummary() {
    return (
        <div className={styles.futBody}>
            <Block title="1. ليش تنظيم الوقت مهم؟">
                <Points items={[
                    'الجامعة غير الثانوية: ما أحد يلاحقك ويذكّرك بالواجبات ولا يقول لك ذاكر. الدكتور يهتم بتقدمك لكنه ما راح يدير وقتك عنك، وحتى الوظيفة أحيانًا فيها نظام أكثر من الجامعة.',
                    'ومع الدوام والعائلة والمشاوير والمناسبات والاستراحة والشلة، تتزاحم الأولويات ويصعب ترتيبها.',
                    'الدراسة عن بُعد (بلاك بورد أو زووم) أصعب: الساعات والصفحات قريبة من الحضوري، لكن ما أحد يشوفك فتصير أسهل للتأجيل.',
                    'إدارة الوقت ببساطة: تتوقع بدقة كم تحتاج المهمة، ثم تحجز لها هذا الوقت فعلًا. وإذا عندك طريقة واضحة لكل جزء فأنت في الطريق الصحيح.',
                ]} />
            </Block>

            <Block title="2. كم ستأخذ منك المهمة؟">
                <p className={styles.futText}>
                    أصعب شيء في تنظيم الوقت هو توقّع مدة المهمة بدقة. أغلبنا نقول «ساعة وأخلصها» ثم تطلع ثلاث ساعات، خصوصًا ونحن منشغلين.
                    احسب حساب المجهول والمقاطعات (اتصال، رسالة، ضيف، مشوار طارئ). وحتى القراءة تختلف حسب النوع:
                    قراءة كتاب خفيف أسرع من مقرر تقني، لكن قد يكون العكس إذا كان أسلوبه قديمًا أو صعبًا.
                </p>
                <div className={styles.futSubTitle}>عناصر تقدير الوقت</div>
                <Points items={[
                    'افهم المطلوب في كل مهمة أو واجب',
                    'اعرف كل المواد والبيانات والمصادر التي ستحتاجها',
                    'انتبه لوقت البحث والانتظار وانتظار الردود',
                    'تأكد من ترتيب الخطوات وأيها يعتمد على الثاني',
                    'اعرف المواعيد المرحلية، مثل تسليم المسودة الأولى',
                ]} />
                <div className={styles.futSubTitle}>أوقات تقريبية لأشياء تسويها كل أسبوع</div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>النشاط</th>
                                <th>الوقت المتوقع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TIME_TABLE.map((row) => (
                                <tr key={row.activity}>
                                    <td>{row.activity}</td>
                                    <td style={{ fontWeight: 800 }}>{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className={styles.futTip}>
                    هذه متوسطات فقط، وما يضر لو كنت أبطأ أو أسرع شوي. ما فيه «وقت صحيح»، المهم تعرف وقتك أنت فعليًا وتخطط على أساسه.
                    جرّب تسجل كم أخذت منك أول كم مهمة، وبعدها تصير توقعاتك أدق.
                </p>
            </Block>

            <Block title="3. كيف ترتّب أولوياتك؟">
                <p className={styles.futText}>
                    الأولوية معناها تقدّم بعض المهام على بعض. كن مرنًا، لكن التزم بأولوياتك قدر الإمكان.
                    من السهل أن تنجرّ لأي شيء يطرأ عليك، مثل رسالة في القروب أو طلعة مفاجئة، خصوصًا إذا كنت متوترًا من مهمة،
                    لكن اسأل نفسك: هل هذا يخدم أهدافي؟ ترتيب المهام أولًا قد يكون الفرق بين إنجاز كل شيء بشكل جيد وبين عدم إنجاز أي شيء.
                </p>
                <div className={styles.futSubTitle}>تأكد أنك فاهم المطلوب في كل مهمة</div>
                <p className={styles.futText}>
                    لو افترضت أن واجبًا ياخذ ساعة فأجّلته، ثم اكتشفت أن فيه أجزاء إضافية وأنه يحتاج أربع ساعات، تكون وقعت في الفخ.
                    وأحيانًا مهمة تعتمد على أخرى (مثل تجربة مختبر ثم تقرير عنها)، فإذا ما انتبهت تسلّمها بترتيب خاطئ وتبدأ من الصفر.
                </p>
                <div className={styles.futSubTitle}>دائمًا افعل التالي</div>
                <Points items={[
                    'اقرأ المطلوب كاملًا، أو دوّن ملاحظات مفصلة لما يشرحه الدكتور',
                    'اسأل ولا تفترض. سؤال في المحاضرة أو في الساعات المكتبية يوفر عليك ساعات',
                    'اعرض عملك على الدكتور أو المعيد أو زميل متمكن قبل التسليم إن أمكن، فهذا يفيد وقتك وغالبًا درجتك',
                    'إذا تحتاج معمل أو مكتبة أو جهاز أو رد من أحد، أدخل هذا الوقت في خطتك من البداية',
                ]} />
            </Block>

            <Block title="4. التعامل مع التسويف">
                <p className={styles.futText}>
                    التسويف هو تأجيل مهمة لازم تنجزها. كلنا نسوّف بدرجات، والتسويف البسيط ما يقلق، لكنه يصير خطيرًا إذا:
                </p>
                <Points items={[
                    'صار عادة مستمرة',
                    'تراكمت عليك مهام كثيرة والوقت قليل',
                    'المهمة المؤجلة مهمة جدًا (مثل مشروع أو اختبار كبير)',
                ]} />
                <div className={styles.futSubTitle}>أربع وسائل للتغلب عليه</div>
                <div className={styles.futCards}>
                    <div className={styles.futMini}><b>🗂️ نظّم نفسك</b><span>جدول أسبوعي وأهداف صغيرة واضحة. هذا أقوى علاج للتسويف.</span></div>
                    <div className={styles.futMini}><b>🔕 أبعد المشتتات</b><span>المشتت الأول هو «بس شوي»: كم مقطع في تيك توك، سنابات، يوتيوب، جولة بلايستيشن، مسلسل تكمله. حط الجوال بعيد أو على وضع الطيران وقت المذاكرة.</span></div>
                    <div className={styles.futMini}><b>🎁 كافئ نفسك</b><span>خل الطلعة أو القهوة أو المسلسل مكافأة بعد ما تخلص المطلوب، مو وسيلة للهروب منه.</span></div>
                    <div className={styles.futMini}><b>🤝 خل أحد يحاسبك</b><span>قل لصاحبك أو أخوك أو أمك: «أخلص هذا قبل الساعة كذا». لما نخبر غيرنا نلتزم أكثر. وممكن تذاكرون مع بعض بشرط تبقى المذاكرة مذاكرة وما تتحول لسواليف.</span></div>
                </div>
            </Block>

            <Block title="5. طرق تنظيم الوقت والأولويات">
                <div className={styles.futSubTitle}>📆 التقويم والقوائم والتذكيرات</div>
                <Points items={[
                    'وحّد تقويمك وقوائم مهامك في مكان واحد قدر الإمكان، مثل تقويم الجوال.',
                    'التزم بإضافة كل شيء: المحاضرات والاختبارات والتسليمات والاجتماعات.',
                    'إذا أغلب مهامك تجي من نظام الجامعة (مثل بلاك بورد) فاعتمد عليه، وأضف يدويًا نشاطك الشخصي مثل النادي والعمل والمناسبات العائلية.',
                    'أو استخدم تقويم Google وأدخل فيه كل شيء.',
                ]} />
                <p className={styles.futTip}>
                    💡 نصيحة: لا تشترِ مخططًا غاليًا ولا تشترك في تطبيق مدفوع من أول يوم. جرّب نماذج مجانية تطبعها، أو تطبيقات مجانية أو بنسخة تجريبية، وبعدها اعتمد اللي يناسبك.
                </p>

                <div className={styles.futSubTitle}>🕌 اجعل الصلوات محطات في جدولك</div>
                <p className={styles.futText}>
                    من أسهل الطرق للالتزام: وزّع يومك على أوقات الصلاة، فكل فترة بين صلاتين تصير جلسة مذاكرة مركزة (من 45 إلى 90 دقيقة)
                    بعدها راحة قصيرة. بهذا يكون جدولك واقعيًا ومرتبطًا بيومك، وتتجنب السهر الطويل قبل الاختبار.
                    وجرّب تخصص الجمعة أو السبت للمراجعة الأسبوعية مع قدر من الراحة.
                </p>

                <div className={styles.futSubTitle}>🧭 مصفوفة أيزنهاور (2×2)</div>
                <p className={styles.futText}>
                    اكتب قائمة بمهامك، ثم وزّعها على أربعة مربعات حسب الأهمية والاستعجال.
                    الاستعجال = متى تحتاج تخلصها، والأهمية = كم هي ضرورية وحساسة.
                </p>
                <div className={styles.futQuad}>
                    <div />
                    <div className={styles.futQuadHead}>عاجل<small>خلال يومين تقريبًا</small></div>
                    <div className={styles.futQuadHead}>غير عاجل<small>بعد أسبوعين تقريبًا</small></div>

                    <div className={styles.futQuadHead}>مهم<small>له نسبة كبيرة من الدرجة</small></div>
                    <div className={cx(styles.futQuadCell, styles.futQuadHot)}>
                        <b>عاجل ومهم</b>
                        <span>ابدأ فيه أولًا</span>
                        <em>مثل: ميد بعد يومين</em>
                    </div>
                    <div className={styles.futQuadCell}>
                        <b>غير عاجل ومهم</b>
                        <span>رتّبه حسب موعد التسليم</span>
                        <em>مثل: فاينل أو مشروع بعد أسابيع</em>
                    </div>

                    <div className={styles.futQuadHead}>غير مهم<small>اختياري أو درجات إضافية</small></div>
                    <div className={styles.futQuadCell}>
                        <b>عاجل وغير مهم</b>
                        <span>رتّبه حسب موعد التسليم</span>
                        <em>مثل: واجب اختياري ينتهي بكرة</em>
                    </div>
                    <div className={styles.futQuadCell}>
                        <b>غير عاجل وغير مهم</b>
                        <span>رتّبه حسب موعد التسليم</span>
                        <em>مثل: درجات إضافية بعيدة</em>
                    </div>
                </div>
                <Points items={[
                    'كن صريحًا مع نفسك في الحكم على الاستعجال والأهمية، فأحيانًا نهرب من المهام المملة أو المزعجة.',
                    'ابدأ بالمربع اللي يجمع «عاجل ومهم»، مثل ميد بعد يومين.',
                    'وباقي المهام رتّبها حسب موعد التسليم.',
                ]} />
            </Block>

            <p className={styles.futSource}>
                المصدر الأصلي: OpenStax، كتاب College Success (Managing Time and Priorities)، محتوى مفتوح الترخيص، لُخّص وعُدّل ليناسبك.
            </p>
        </div>
    );
}

export function Futures() {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.futWrap}>
            <div className={styles.card}>
                <Link href="/absence" className={styles.btn} style={{ textDecoration: 'none' }}>
                    <span aria-hidden="true">📅</span>
                    <span>الضمير الغائب</span>
                </Link>
            </div>

            <div className={cx(styles.card, styles.futAcc)}>
                <button
                    type="button"
                    className={styles.futAccHead}
                    aria-expanded={open}
                    aria-controls="fut-time-body"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={styles.futAccIcon} aria-hidden="true">⏳</span>
                    <span className={styles.futAccText}>
                        <span className={styles.futAccTitle}>تنظيم الوقت والأولويات</span>
                        <span className={styles.futAccSub}>ملخص كامل: التقدير، الأولويات، التسويف، وطرق التنظيم</span>
                    </span>
                    <span className={cx(styles.futChevron, open && styles.futChevronOpen)} aria-hidden="true">▾</span>
                </button>
                {open && <div id="fut-time-body"><TimeManagementSummary /></div>}
            </div>
        </div>
    );
}
