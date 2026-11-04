// src/lib/questions/mastery.ts
// إتقان الأفكار: تُعد الفكرة متقنة بعد حل سؤالين مختلفين صح.
// التقدم محفوظ في متصفح الطالب فقط (localStorage).

const STORAGE_KEY = 'math101_idea_progress';
const LEGACY_KEY = 'module_1_completed_items';

export const MASTERY_TARGET = 2;

export interface IdeaProgress {
    tried: boolean;
    solved: string[]; // معرفات الأسئلة المختلفة التي حلها صح
}

export type IdeaProgressMap = Record<string, IdeaProgress>;
export type IdeaStatus = 'new' | 'practicing' | 'mastered';

function readStorage(): IdeaProgressMap | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function writeStorage(progress: IdeaProgressMap) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

export function loadIdeaProgress(): IdeaProgressMap {
    return readStorage() ?? fromLegacy();
}

/** يسجل نتيجة سؤال ويرجع التقدم الجديد. نفس السؤال لا يُحسب مرتين */
export function recordIdeaResult(ideaKey: string, questionId: string, isCorrect: boolean): IdeaProgressMap {
    const progress = loadIdeaProgress();
    const current = progress[ideaKey] ?? { tried: false, solved: [] };
    const solved = isCorrect && !current.solved.includes(questionId)
        ? [...current.solved, questionId]
        : current.solved;

    const updated = { ...progress, [ideaKey]: { tried: true, solved } };
    writeStorage(updated);
    return updated;
}

export function getIdeaStatus(progress?: IdeaProgress): IdeaStatus {
    if (!progress?.tried) return 'new';
    return progress.solved.length >= MASTERY_TARGET ? 'mastered' : 'practicing';
}
