// components/Questions/Engine/validator.ts

/**
 * يتحقق من صحة إجابة الطالب
 * @param selectedOption - الخيار الذي اختاره الطالب
 * @param correctAnswer - الإجابة الصحيحة
 * @returns true إذا كانت الإجابة صحيحة
 */
export const checkAnswer = (selectedOption: string | null, correctAnswer: string): boolean => {
  if (!selectedOption) return false;
  // تنظيف المسافات الزائدة لتجنب الأخطاء المطبعية
  return selectedOption.trim() === correctAnswer.trim();
};