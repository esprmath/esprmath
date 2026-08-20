'use client'

import QuizEngine from '../QuizEngine'
import { math101Module1Questions } from '../../question-bank/data'

export default function Quiz1Page() {
    // روابط تجريبية حتى تتأكد أن الفيديو يفتح داخل نفس صفحة الكويز.
    // بعد التجربة استبدلها بروابط مقاطعك الحقيقية.
    const reviewVideoUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    const leaksVideoUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    return (
        <QuizEngine
            title="Quiz 1 - Math 101"

            // مصدر الأسئلة
            questions={math101Module1Questions}

            // الشباتر الداخلة في Quiz 1
            chapters={[
                '1.5',
                '1.6',
                '2.1',
                '1.8',
                '3.4'
            ]}

            // زر العودة يرجع لصفحة الكورس
            coursePath="/workspace/101"

            // مفتاح أخطاء Quiz 1
            savedMistakesKey="math101_quiz1_saved_mistakes"

            // روابط المقاطع - تمرر للمحرك مباشرة
            reviewVideoUrl={reviewVideoUrl}
            leaksVideoUrl={leaksVideoUrl}
        />
    )
}