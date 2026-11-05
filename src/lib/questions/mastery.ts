// src/lib/questions/mastery.ts
// إتقان الأفكار: تُعد الفكرة متقنة بعد حل سؤالين مختلفين صح.
// التقدم محفوظ في متصفح الطالب فقط (localStorage)، ولكل كورس سجله.

const LEGACY_KEY = 'module_1_completed_items';

export const MASTERY_TARGET = 2;

export interface IdeaProgress {
    tried: boolean;
    solved: string[]; // معرفات الأسئلة المختلفة التي حلها صح
}

export type IdeaProgressMap = Record<string, IdeaProgress>;
export type IdeaStatus = 'new' | 'practicing' | 'mastered';

const storageKey = (courseId: string) => `math${courseId}_idea_progress`;

/** مفتاح نسبة الموديول. كورس 101 يبقى على اسمه القديم حتى لا يفقد الطلاب تقدمهم */
export const moduleProgressKey = (courseId: string, moduleNumber: number | string) =>
    courseId === '101' ? `module_${moduleNumber}_progress` : `math${courseId}_module_${moduleNumber}_progress`;

function readStorage(courseId: string): IdeaProgressMap | null {
    try {
        const saved = localStorage.getItem(storageKey(courseId));
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function writeStorage(courseId: string, progress: IdeaProgressMap) {
    try {
        localStorage.setItem(storageKey(courseId), JSON.stringify(progress));
    } catch {
        // إذا امتلأت مساحة المتصفح يستمر الطالب، لكن التقدم لا يُحفظ
    }
}

/** الفكرة التي كانت "مكتملة" في النظام القديم تُحسب بسؤال صحيح واحد */
function fromLegacy(): IdeaProgressMap {
    try {
        const completed: string[] = JSON.parse(localStorage.getItem(LEGACY_KEY) || '[]');
        return Object.fromEntries(completed.map((key) => [key, { tried: true, solved: ['legacy'] }]));
    } catch {
        return {};
    }
}

export function loadIdeaProgress(courseId: string): IdeaProgressMap {
    return readStorage(courseId) ?? (courseId === '101' ? fromLegacy() : {});
}

/** يسجل نتيجة سؤال ويرجع التقدم الجديد. نفس السؤال لا يُحسب مرتين */
export function recordIdeaResult(courseId: string, ideaKey: string, questionId: string, isCorrect: boolean): IdeaProgressMap {
    const progress = loadIdeaProgress(courseId);
    const current = progress[ideaKey] ?? { tried: false, solved: [] };
    const solved = isCorrect && !current.solved.includes(questionId)
        ? [...current.solved, questionId]
        : current.solved;

    const updated = { ...progress, [ideaKey]: { tried: true, solved } };
    writeStorage(courseId, updated);
    return updated;
}

export function getIdeaStatus(progress?: IdeaProgress): IdeaStatus {
    if (!progress?.tried) return 'new';
    return progress.solved.length >= MASTERY_TARGET ? 'mastered' : 'practicing';
}
