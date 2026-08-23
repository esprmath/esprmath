'use client'

import QuizEngine from '../QuizEngine'
import { math101Module1Questions } from '../../quesbank/data/module1'

export default function Quiz1Page() {

    const reviewVideoUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    const leaksVideoUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    return (
        <QuizEngine
            title="Quiz 1 - Math 101"

            // الداتا التي تحتوي على math مثل m15q20
            questions={math101Module1Questions}

            chapters={[
                '1.5',
                '1.6',
                '2.1',
                '1.8',
                '3.4'
            ]}

            coursePath="/workspace/101"

            savedMistakesKey="math101_quiz1_saved_mistakes"

            reviewVideoUrl={reviewVideoUrl}
            leaksVideoUrl={leaksVideoUrl}
        />
    )
}