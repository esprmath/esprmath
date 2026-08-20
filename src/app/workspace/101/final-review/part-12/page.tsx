'use client'

import FinalReviewEngine, {
    FinalQuestion,
    ReviewIdea
} from '../FinalReviewEngine'

const reviewIdeas: ReviewIdea[] = [
    {
        key: '1-1.5-idea-1',
        moduleId: 1,
        chapter: '1.5',
        ideaId: 'idea-1',
        title: 'إيجاد النهاية بالتعويض',
        reminder:
            'إذا كانت الدالة معرفة ومستمرة عند النقطة، ابدأ بالتعويض المباشر.',
        steps: [
            'حدد القيمة التي يقترب منها x.',
            'عوض بالقيمة مباشرة في الدالة.',
            'إذا حصلت على قيمة محددة فهي النهاية.'
        ],
        exampleQuestion:
            'أوجد نهاية f(x) = x + 2 عندما x تقترب من 3.',
        exampleSolution:
            'نعوض x = 3 مباشرة: 3 + 2 = 5، إذن النهاية تساوي 5.',
        checkQuestion:
            'إذا كانت f(x) = x²، فما النهاية عندما x تقترب من 2؟',
        checkOptions: ['2', '4', '6', '8'],
        correctAnswer: '4',
        ideaLink: '/workspace/101/1?chapter=1.5&idea=idea-1'
    },
    {
        key: '1-1.6-idea-1',
        moduleId: 1,
        chapter: '1.6',
        ideaId: 'idea-1',
        title: 'قوانين النهايات',
        reminder:
            'يمكن استخدام قوانين الجمع والطرح والضرب والقسمة لحساب النهايات.',
        steps: [
            'حدد العملية الموجودة في السؤال.',
            'احسب نهاية كل جزء.',
            'طبق قانون النهاية المناسب.'
        ],
        exampleQuestion:
            'إذا كانت نهاية f(x) = 2 ونهاية g(x) = 3، فما نهاية f(x) + g(x)؟',
        exampleSolution:
            'نستخدم قانون الجمع: 2 + 3 = 5.',
        checkQuestion:
            'إذا كانت نهاية f(x) = 4 ونهاية g(x) = 2، فما نهاية f(x) × g(x)؟',
        checkOptions: ['2', '6', '8', '10'],
        correctAnswer: '8',
        ideaLink: '/workspace/101/1?chapter=1.6&idea=idea-1'
    },
    {
        key: '2-2.3-idea-1',
        moduleId: 2,
        chapter: '2.3',
        ideaId: 'idea-1',
        title: 'قاعدة القوة في الاشتقاق',
        reminder:
            'عند اشتقاق x مرفوعة لقوة، ننزل الأس وننقص منه واحد.',
        steps: [
            'حدد الأس.',
            'اضرب المعامل في الأس.',
            'أنقص الأس بمقدار واحد.'
        ],
        exampleQuestion:
            'أوجد مشتقة f(x) = x³.',
        exampleSolution:
            'ننزل الأس 3 ثم ننقصه واحد: f′(x) = 3x².',
        checkQuestion:
            'ما مشتقة f(x) = x⁴؟',
        checkOptions: ['x³', '3x⁴', '4x³', '4x⁴'],
        correctAnswer: '4x³',
        ideaLink: '/workspace/101/2?chapter=2.3&idea=idea-1'
    },
    {
        key: '2-2.5-idea-1',
        moduleId: 2,
        chapter: '2.5',
        ideaId: 'idea-1',
        title: 'قاعدة السلسلة',
        reminder:
            'نستخدم قاعدة السلسلة عندما تكون لدينا دالة داخل دالة.',
        steps: [
            'حدد الدالة الخارجية.',
            'اشتق الدالة الخارجية.',
            'اضرب في مشتقة الدالة الداخلية.'
        ],
        exampleQuestion:
            'أوجد مشتقة (x² + 1)³.',
        exampleSolution:
            'مشتقة الخارجية = 3(x² + 1)²، ثم نضرب في مشتقة الداخلية 2x، فيكون الناتج 6x(x² + 1)².',
        checkQuestion:
            'في قاعدة السلسلة، ماذا نفعل بعد اشتقاق الدالة الخارجية؟',
        checkOptions: [
            'نجمع الدالة الداخلية',
            'نضرب في مشتقة الدالة الداخلية',
            'نقسم على الدالة الداخلية',
            'نتوقف'
        ],
        correctAnswer: 'نضرب في مشتقة الدالة الداخلية',
        ideaLink: '/workspace/101/2?chapter=2.5&idea=idea-1'
    }
]

const questions: FinalQuestion[] = [
    {
        id: 9001,
        moduleId: 1,
        module: 'Module 1',
        chapter: '1.5',
        ideaId: 'idea-1',
        level: 'سهل',
        questionName: 'سؤال تجريبي - النهايات',
        question:
            'إذا كانت f(x) = x + 4، فما النهاية عندما x تقترب من 2؟',
        ideaLink:
            '/workspace/101/1?chapter=1.5&idea=idea-1',
        answer: '6',
        options: ['4', '5', '6', '8'],
        correctAnswer: '6',
        solutionText:
            'نعوض x = 2 مباشرة، فيكون 2 + 4 = 6.',
        source: 'review'
    },
    {
        id: 9002,
        moduleId: 1,
        module: 'Module 1',
        chapter: '1.6',
        ideaId: 'idea-1',
        level: 'سهل',
        questionName: 'سؤال تجريبي - قوانين النهايات',
        question:
            'إذا كانت نهاية f(x) = 3 ونهاية g(x) = 5، فما نهاية f(x) + g(x)؟',
        ideaLink:
            '/workspace/101/1?chapter=1.6&idea=idea-1',
        answer: '8',
        options: ['2', '5', '8', '15'],
        correctAnswer: '8',
        solutionText:
            'باستخدام قانون الجمع: 3 + 5 = 8.',
        source: 'review'
    },
    {
        id: 9003,
        moduleId: 2,
        module: 'Module 2',
        chapter: '2.3',
        ideaId: 'idea-1',
        level: 'سهل',
        questionName: 'سؤال تجريبي - الاشتقاق',
        question:
            'ما مشتقة f(x) = x⁵؟',
        ideaLink:
            '/workspace/101/2?chapter=2.3&idea=idea-1',
        answer: '5x⁴',
        options: ['x⁴', '4x⁵', '5x⁴', '5x⁵'],
        correctAnswer: '5x⁴',
        solutionText:
            'باستخدام قاعدة القوة: ننزل 5 وننقص الأس واحد، فيكون الناتج 5x⁴.',
        source: 'review'
    },
    {
        id: 9004,
        moduleId: 2,
        module: 'Module 2',
        chapter: '2.5',
        ideaId: 'idea-1',
        level: 'متوسط',
        questionName: 'سؤال تجريبي - قاعدة السلسلة',
        question:
            'أي قاعدة نستخدم غالباً عند اشتقاق دالة داخل دالة؟',
        ideaLink:
            '/workspace/101/2?chapter=2.5&idea=idea-1',
        answer: 'قاعدة السلسلة',
        options: [
            'قاعدة السلسلة',
            'قاعدة الجمع',
            'قاعدة النهاية',
            'قاعدة الثابت'
        ],
        correctAnswer: 'قاعدة السلسلة',
        solutionText:
            'عندما تكون لدينا دالة مركبة، نستخدم قاعدة السلسلة.',
        source: 'review'
    }
]

export default function FinalPart12Page() {
    const videoUrl = 'ضع-رابط-مقطع-مراجعة-Module-1-و-Module-2-هنا'

    return (
        <FinalReviewEngine
            title="الجزء الأول — Module 1 + Module 2"
            subtitle="راجع أفكار المودلين الأول والثاني، ثم تدرب عليها مباشرة."
            modules={[1, 2]}
            mode="normal"
            questions={questions}
            reviewIdeas={reviewIdeas}
            videoUrl={videoUrl}
            progressKey="math101_final_part-12_progress"
            mistakesKey="math101_final_part-12_mistakes"
            coursePath="/workspace/101/final-review"
        />
    )
}