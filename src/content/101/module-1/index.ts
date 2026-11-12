// ════════════════════════════════════════════════════════════
// Math 101 · الـ Module 1
// هذا الملف يجمع Chapters الـ Module. ترتيب القائمة هو ترتيب ظهورها للطالب.
// ════════════════════════════════════════════════════════════
import type { ModuleContent } from '@/types/math';
import { chapter1_5Data } from './chapter-1.5';
import { chapter1_6Data } from './chapter-1.6';
import { chapter2_1Data } from './chapter-2.1';
import { chapter1_8Data } from './chapter-1.8';
import { chapter3_4Data } from './chapter-3.4';
import { extraQuestions } from './extra-questions';

export const module1: ModuleContent = {
    courseId: '101',
    moduleNumber: '1',
    title: 'Module 1',
    chapters: [chapter1_5Data, chapter1_6Data, chapter2_1Data, chapter1_8Data, chapter3_4Data],
    extraQuestions,
};
