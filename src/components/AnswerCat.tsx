'use client';

import { useEffect, useState } from 'react';
import { ANSWER_CATS } from '@/content/nudges';

/** مدة بقاء القطو على الشاشة. لازم تطابق مدة الأنيميشن answer-cat-toast في globals.css */
const SHOW_MS = 3000;

/**
 * إشعار قطو عائم يظهر عند الجواب ويختفي بعد 3 ثواني: كرت أحمر للغلط، وموافقة للصح.
 * trigger: أي قيمة تتغير مع كل تحقق جديد (مثل نتيجة التصحيح) ليظهر الإشعار من جديد.
 */
export default function AnswerCat({ correct, trigger }: { correct: boolean; trigger?: unknown }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = window.setTimeout(() => setVisible(false), SHOW_MS);
        return () => window.clearTimeout(timer);
    }, [correct, trigger]);

    if (!visible) return null;
    return (
        <img
            className="answer-cat"
            src={correct ? ANSWER_CATS.correct : ANSWER_CATS.wrong}
            alt=""
            height={100}
            style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                zIndex: 70,
                height: '100px',
                width: 'auto',
                pointerEvents: 'none',
            }}
        />
    );
}
