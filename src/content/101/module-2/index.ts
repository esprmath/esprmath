// ════════════════════════════════════════════════════════════
// Math 101 · الـ Module 2
// هذا الملف يجمع Chapters الـ Module. ترتيب القائمة هو ترتيب ظهورها للطالب.
// ════════════════════════════════════════════════════════════
import type { ModuleContent } from '@/types/math';
import { chapter2_3Data } from './chapter-2.3';
import { chapter2_4Data } from './chapter-2.4';
import { chapter2_5Data } from './chapter-2.5';
import { chapter2_6Data } from './chapter-2.6';
import { chapter2_7Data } from './chapter-2.7';

export const module2: ModuleContent = {
    courseId: '101',
    moduleNumber: '2',
    title: 'Module 2',
    chapters: [chapter2_3Data, chapter2_4Data, chapter2_5Data, chapter2_6Data, chapter2_7Data],
    extraQuestions: [],
};
