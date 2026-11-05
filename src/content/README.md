# محتوى الكورسات

المحتوى هنا، والتصميم في مكان واحد: `src/components/module/ModulePage.tsx`.

```
src/content/
  101/                    الكورس
    module-1/             الموديول
      index.ts            يجمع الشباتر ويحدد ترتيبها
      chapter-1.5.ts      شابتر: الأفكار، الشرح النظري، رابط المقطع، الأسئلة
      extra-questions.ts  أسئلة الأفكار التي ليس لها قالب
```

## تعديل الشرح أو المقطع

افتح ملف الشابتر، وابحث عن رقم الفكرة. كل فكرة فيها:

- `📖 الشرح النظري`: تعدّل `stepTitle` و `stepDescription`.
- `🎬 رابط المقطع`: تلصق رابط يوتيوب بأي صيغة، أو تتركه `""` فيختفي قسم المقطع.
- `✍️ الأسئلة`: تحدد قالب السؤال.

لا تغيّر `id` الفكرة بعد نشرها، لأن تقدم الطلاب محفوظ عليه.

## إعداد كويز

كل كويز له ملف مثل `src/content/101/quiz-1.ts`، تحدد فيه الشباتر، وأفكار الاختبارات السابقة، وعدد أسئلة الاختبار التجريبي ووقته. والشاشات في `src/components/quiz`.

لإضافة كويز جديد:

1. انسخ `quiz-1.ts` وعدّل إعداداته. `quizId` لازم يطابق `quiz_id` في لوحة التحكم.
2. أنشئ صفحته `src/app/workspace/101/quizzes/quiz-2/page.tsx` بنفس شكل صفحة `quiz-1`.
3. أضف `quiz-2` إلى `QUIZ_PAGES` في `src/lib/courseAccess.ts`.

## إضافة موديول جديد

مثال: الموديول 2 من كورس 101.

1. أنشئ `src/content/101/module-2/` فيه ملف لكل شابتر، بنفس شكل ملفات الموديول الأول.
2. أنشئ `index.ts` واجمع فيه الشباتر، واجعل `moduleNumber: '2'`.
3. استبدل محتوى `src/app/workspace/101/2/page.tsx` بهذا:

   ```tsx
   'use client';

   import ModulePage from '@/components/module/ModulePage';
   import { module2 } from '@/content/101/module-2';

   export default function Page() {
       return <ModulePage content={module2} />;
   }
   ```

4. أضف الموديول إلى قائمة `ALL_MODULES` في `src/content/content.test.ts`.
5. شغّل `npm test` ليفحص المحتوى.
