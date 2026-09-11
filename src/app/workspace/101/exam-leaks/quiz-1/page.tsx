'use client'

import QuizEngine, { QuizDataQuestion } from '../QuizEngine'
import { moreQuesData } from '../../1/moreques'

export default function Quiz1Page() {

    const reviewVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const leaksVideoUrl = 'https://youtu.be/SH8Mw7mWB4s?si=qUm2GkXS1pwR2DtY'

    // 1. تحويل الأسئلة الإضافية والتسريبات بالكامل لتكون متاحة لدى المحرك
    const formattedQuestions: QuizDataQuestion[] = []
    let globalId = 1

    moreQuesData.forEach((item) => {
        if (item.subQuestions && item.subQuestions.length > 0) {
            item.subQuestions.forEach((sub, subIdx) => {
                formattedQuestions.push({
                    id: globalId++,
                    moduleId: Number(item.meta.moduleNumber) || 1,
                    module: `Module ${item.meta.moduleNumber}`,
                    chapter: item.meta.chapterNumber,
                    ideaId: item.meta.ideaNumber,
                    level: 'متوسط',
                    questionName: `${item.meta.ideaName} (${subIdx + 1})`,
                    question: `${item.questionText} \n ${sub.questionText}`,
                    math: sub.mathExpression || item.mathExpression || '',
                    ideaLink: `#${item.meta.ideaAnchorId}`,
                    answer: sub.questionExplanation || item.questionExplanation || '',
                    options: sub.options || [],
                    correctAnswer: sub.correctAnswer || '',
                    solutionText: sub.questionExplanation || '',
                    source: 'review',
                    examId: 'quiz-1',
                    image: item.graphImage || ''
                })
            })
        } else {
            formattedQuestions.push({
                id: globalId++,
                moduleId: Number(item.meta.moduleNumber) || 1,
                module: `Module ${item.meta.moduleNumber}`,
                chapter: item.meta.chapterNumber,
                ideaId: item.meta.ideaNumber,
                level: 'متوسط',
                questionName: item.meta.ideaName,
                question: item.questionText,
                math: item.mathExpression || '',
                ideaLink: `#${item.meta.ideaAnchorId}`,
                answer: item.questionExplanation || '',
                options: item.options || [],
                correctAnswer: item.correctAnswer || '',
                solutionText: item.questionExplanation || '',
                source: 'review',
                examId: 'quiz-1',
                image: item.graphImage || ''
            })
        }
    })

    return (
        <QuizEngine
            title="Quiz 1 - Math 101"
            questions={formattedQuestions}
            chapters={['1.5', '1.6', '2.1', '1.8', '3.4']}

            // 💡 هنا تحط الأفكار اللي تبيه يسحب منها (تأكد أن الصيغة تطابق قيم chapter و ideaId في أسئلتك)
            // مثال: لو الشابتر '1.5' ورقم الفكرة في البيانات '1'، سيكون المفتاح '1.5-1'
            allowedIdeas={[
                '1.5-1.2',
                '1.5-1.4',
                '2.1-3.1',
                '1.8-4.1',
                '3.4-5.1'

            ]}

            coursePath="/workspace/101"
            savedMistakesKey="math101_quiz1_saved_mistakes"
            reviewVideoUrl={reviewVideoUrl}
            leaksVideoUrl={leaksVideoUrl}
        />
    )
}