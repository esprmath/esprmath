'use client';

import { useEffect } from 'react';
import { enterIdea } from '@/lib/activity';
import { videoSecondsOf } from '@/lib/lessonTime';

/** يُركَّب مع درس الفكرة (بـ key الفكرة): يبدأ عدّ وقتها ويوقفه عند الخروج منها. لا يعرض شيئًا */
export default function IdeaTracker({ courseId, ideaKey, videoUrl }: { courseId: string; ideaKey: string; videoUrl?: string }) {
    useEffect(() => enterIdea(courseId, ideaKey, videoSecondsOf(videoUrl)), [courseId, ideaKey, videoUrl]);
    return null;
}
