'use client'

import QuizEngine, { QuizDataQuestion } from '../QuizEngine'
import { buildAdditionalQuestions, generateFromTemplate } from '@/lib/questions/additional'
import { chapter1_5Data } from '../../1/1.5'
import { chapter1_6Data } from '../../1/1.6'
import { chapter2_1Data } from '../../1/2.1'
import { chapter1_8Data } from '../../1/1.8'
import { chapter3_4Data } from '../../1/3.4'
import { moreQuesData } from '../../1/moreques'

const QUIZ_CHAPTERS = [chapter1_5Data, chapter1_6Data, chapter2_1Data, chapter1_8Data, chapter3_4Data]

/** يبني أسئلة الكويز من أفكار الشباتر: كل استدعاء يولّد أسئلة جديدة من القوالب */
function buildQuizQuestions(): QuizDataQuestion[] {
    const questions: QuizDataQuestion[] = []
    let globalId = 1

    buildAdditionalQuestions(QUIZ_CHAPTERS, moreQuesData).forEach((base) => {
        const item = base.templateId ? generateFromTemplate(base) : base
        const { meta } = item

        const shared = {
            moduleId: Number(meta.moduleNumber) || 1,
            module: `Module ${meta.moduleNumber}`,
            chapter: meta.chapterNumber,
            ideaId: meta.ideaNumber,
            level: 'متوسط' as const,
            ideaLink: `/workspace/101/${meta.moduleNumber}?chapter=${meta.chapterNumber}&idea=${meta.ideaAnchorId}`,
            source: 'review' as const,
            examId: 'quiz-1' as const,
            image: item.graphImage || ''
        }

        if (item.subQuestions && item.subQuestions.length > 0) {
            item.subQuestions.forEach((sub: any, subIdx: number) => {
                questions.push({
                    ...shared,
                    id: globalId++,
                    questionName: `${meta.ideaName} (${subIdx + 1})`,
                    question: `${item.questionText} \n ${sub.questionText}`,
                    math: sub.mathExpression || item.mathExpression || '',
                    answer: sub.questionExplanation || item.questionExplanation || '',
                    options: sub.options || [],
                    correctAnswer: sub.correctAnswer || '',
                    solutionText: sub.questionExplanation || ''
                })
            })
            return
        }

        // نص الحل يذهب أيضًا للمعلم الذكي، فنضم إليه معادلات الخطوات
        const solutionText = item.steps
            ? item.steps.map((step: { text: string; math?: string }) => `${step.text} ${step.math ?? ''}`.trim()).join('\n')
            : item.questionExplanation || ''

        questions.push({
            ...shared,
            id: globalId++,
            questionName: meta.ideaName,
            question: item.questionText,
            math: item.mathExpression || '',
            answer: solutionText,
            options: item.options || [],
            mathOptionIds: item.mathOptionIds,
            correctAnswer: item.correctAnswer || '',
            solutionText,
            steps: item.steps,
            mastery: {
                ideaKey: `${meta.chapterNumber}-${meta.ideaAnchorId}`,
                questionId: item.generatedKey
            }
        })
    })

    return questions
}

export default function Quiz1Page() {

    const reviewVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const leaksVideoUrl = 'https://youtu.be/SH8Mw7mWB4s?si=qUm2GkXS1pwR2DtY'

    return (
        <QuizEngine
            title="Quiz 1 - Math 101"
            getQuestions={buildQuizQuestions}
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
