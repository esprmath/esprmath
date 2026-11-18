'use client';

import { useEffect, useRef, useState } from 'react';
import { NUDGE_STAGES } from '@/content/nudges';
import NudgeBubble from '@/components/NudgeBubble';

/**
 * يعدّ الوقت الفعلي الذي قضاه الطالب في الفكرة (والتبويب ظاهر)،
 * وإذا تجاوز الوقت المفروض يطلع إشعار بشخصية. يُركَّب بـ key الفكرة فيبدأ العدّ من جديد لكل فكرة.
 */
export default function LessonNudge({ limitMinutes }: { limitMinutes: number }) {
    const [stageIndex, setStageIndex] = useState<number | null>(null);
    const [minutes, setMinutes] = useState(0);
    const seconds = useRef(0);
    const nextStage = useRef(0);

    useEffect(() => {
        // للتجربة فقط: ?nudge=ثواني يقصّر الوقت المفروض
        const testSeconds = process.env.NODE_ENV !== 'production'
            ? Number(new URLSearchParams(window.location.search).get('nudge'))
            : 0;
        const limitSeconds = testSeconds > 0 ? testSeconds : limitMinutes * 60;

        const timer = window.setInterval(() => {
            if (document.visibilityState !== 'visible') return;
            seconds.current += 1;
            const stage = NUDGE_STAGES[nextStage.current];
            if (stage && seconds.current >= limitSeconds + stage.afterMinutes * 60) {
                setStageIndex(nextStage.current);
                setMinutes(Math.max(1, Math.round(seconds.current / 60)));
                nextStage.current += 1;
            }
        }, 1000);
        return () => window.clearInterval(timer);
    }, [limitMinutes]);

    if (stageIndex === null) return null;
    const stage = NUDGE_STAGES[stageIndex];

    return (
        <NudgeBubble
            image={stage.image}
            title={stage.title}
            text={stage.text?.replace('{minutes}', String(minutes))}
            onClose={() => setStageIndex(null)}
        />
    );
}
