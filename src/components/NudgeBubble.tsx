'use client';

/** قطو بفقاعة كلام ثابتة بزاوية الشاشة. تُستخدم في إشعار الدرس وإشعار الخمول */
export default function NudgeBubble({
    image,
    title,
    text,
    onClose,
}: {
    image: string;
    title: string;
    text?: string;
    onClose: () => void;
}) {
    return (
        <div
            className="nudge-root"
            role="status"
            aria-live="polite"
            style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '12px',
                pointerEvents: 'none',
            }}
        >
            {/* فقاعة الكلام: تطلع من القطو */}
            <div
                style={{
                    position: 'relative',
                    maxWidth: 'min(230px, calc(100vw - 48px))',
                    padding: '10px 28px 10px 14px',
                    background: '#fffaf0',
                    border: '2px solid #8c5521',
                    borderRadius: '20px',
                    boxShadow: '0 6px 18px rgba(140, 85, 33, 0.25)',
                    pointerEvents: 'auto',
                }}
            >
                <div style={{ fontWeight: 'bold', color: '#8c5521', fontSize: '0.95rem' }}>{title}</div>
                {text && (
                    <div style={{ marginTop: '3px', fontSize: '0.78rem', color: '#6b4a2b' }}>{text}</div>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="إغلاق الإشعار"
                    style={{ position: 'absolute', top: '6px', left: '10px', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#8c5521', padding: 0 }}
                >
                    ✕
                </button>
                {/* ذيل الفقاعة باتجاه القطو */}
                <span
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        bottom: '-9px',
                        right: '38px',
                        width: '14px',
                        height: '14px',
                        background: '#fffaf0',
                        borderRight: '2px solid #8c5521',
                        borderBottom: '2px solid #8c5521',
                        transform: 'rotate(45deg)',
                    }}
                />
            </div>
            {/* الظل في globals.css (nudge-cat)، حتى ما يتعطل رجوع ألوان القطو لطبيعتها بالوضع الليلي */}
            <img
                className="nudge-cat"
                src={image}
                alt=""
                height={88}
                style={{ height: '88px', width: 'auto' }}
            />
        </div>
    );
}
