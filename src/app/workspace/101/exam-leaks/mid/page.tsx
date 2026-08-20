'use client'

import QuizEngine from '../QuizEngine'

import { math101Module1Questions } from '@/data/module1'
import { math101Module2Questions } from '@/data/module2'

export default function MidtermPage() {
    const midtermQuestions = [
        ...math101Module1Questions,
        ...math101Module2Questions
    ]

    // روابط تجريبية حالياً
    const reviewVideoUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    const leaksVideoUrl =
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    return (
        <QuizEngine
            title="Midterm - Math 101"

            questions={
                midtermQuestions
            }

            chapters={[
                '1.5',
                '1.6',
                '2.1',
                '1.8',
                '3.4',

                '2.3',
                '2.4',
                '2.5',
                '2.6',
                '2.7'
            ]}

            coursePath="/workspace/101"

            savedMistakesKey="math101_midterm_saved_mistakes"

            reviewVideoUrl={
                reviewVideoUrl
            }

            leaksVideoUrl={
                leaksVideoUrl
            }

            // هذا أهم سطر للميد
            leakExamId="midterm"
        />
    )
}