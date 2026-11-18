'use client';

import { useEffect, useRef, useState } from 'react';
import { IDLE_NUDGE } from '@/content/nudges';
import NudgeBubble from '@/components/NudgeBubble';

/**
 * قطو الخمول: يعدّ الثواني التي قضاها الطالب بالصفحة بدون أي حركة (والتبويب ظاهر).
 * أي حركة (ماوس، لمس، كتابة، تمرير) ترجّع العدّ من الصفر، وإذا وصل لـ 3 دقايق يطلع القطو.
 * لا يُركَّب داخل الدروس، لأن الطالب هناك ممكن يشوف المقطع أو يحل السؤال بدون ما يتحرك.
 */
export default function IdleNudge() {
    const [shown, setShown] = useState(false);
    const idleSeconds = useRef(0);

    useEffect(() => {
        // للتجربة فقط: ?idle=ثواني يقصّر وقت الخمول
        const testSeconds = process.env.NODE_ENV !== 'production'
            ? Number(new URLSearchParams(window.location.search).get('idle'))
            : 0;
        const limitSeconds = testSeconds > 0 ? testSeconds : IDLE_NUDGE.afterMinutes * 60;

        const resetIdle = () => {
            idleSeconds.current = 0;
        };
        // الضغط واللمس والكتابة تخفي القطو، وكل الحركات (حتى الماوس والتمرير) ترجّع العدّ
        const dismiss = () => {
            resetIdle();
            setShown(false);
        };

        const passive = { passive: true } as const;
        window.addEventListener('mousemove', resetIdle, passive);
        window.addEventListener('wheel', resetIdle, passive);
        window.addEventListener('scroll', resetIdle, passive);
        window.addEventListener('mousedown', dismiss, passive);
        window.addEventListener('touchstart', dismiss, passive);
        window.addEventListener('keydown', dismiss);

        const timer = window.setInterval(() => {
            if (document.visibilityState !== 'visible') return;
            idleSeconds.current += 1;
            if (idleSeconds.current >= limitSeconds) {
                idleSeconds.current = 0;
                setShown(true);
            }
        }, 1000);

        return () => {
            window.clearInterval(timer);
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('wheel', resetIdle);
            window.removeEventListener('scroll', resetIdle);
            window.removeEventListener('mousedown', dismiss);
            window.removeEventListener('touchstart', dismiss);
            window.removeEventListener('keydown', dismiss);
        };
    }, []);

    if (!shown) return null;

    return (
        <NudgeBubble
            image={IDLE_NUDGE.image}
            title={IDLE_NUDGE.title}
            text={IDLE_NUDGE.text.replace('{minutes}', String(IDLE_NUDGE.afterMinutes))}
            onClose={() => setShown(false)}
        />
    );
}
