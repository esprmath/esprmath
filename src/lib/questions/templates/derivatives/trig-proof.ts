// src/lib/questions/templates/derivatives/trig-proof.ts
// مثل Q-25 في شابتر 2.4: إثبات مشتقة cot x بقاعدة القسمة
import type { QuestionTemplate, TemplateOutput, VariableDefinition } from '../../types';
import { uniqueExcept } from '../utils';

const variables: VariableDefinition[] = [
  { name: 'kind', min: 0, max: 3, integer: true }, // cot أو tan أو sec أو csc
];

const PROOFS = [
  {
    fn: '\\cot x',
    quotient: '\\frac{\\cos x}{\\sin x}',
    substituted: '\\frac{(-\\sin x)(\\sin x) - (\\cos x)(\\cos x)}{\\sin^{2} x}',
    middle: '\\frac{-(\\sin^{2} x + \\cos^{2} x)}{\\sin^{2} x}',
    result: '-\\csc^{2} x',
    wrong: [
      '\\frac{\\sin^{2} x + \\cos^{2} x}{\\sin^{2} x} = \\csc^{2} x',
      '\\frac{\\cos^{2} x - \\sin^{2} x}{\\sin^{2} x} = -\\csc^{2} x',
      '\\frac{-(\\sin^{2} x + \\cos^{2} x)}{\\cos^{2} x} = -\\sec^{2} x',
    ],
  },
  {
    fn: '\\tan x',
    quotient: '\\frac{\\sin x}{\\cos x}',
    substituted: '\\frac{(\\cos x)(\\cos x) - (\\sin x)(-\\sin x)}{\\cos^{2} x}',
    middle: '\\frac{\\cos^{2} x + \\sin^{2} x}{\\cos^{2} x}',
    result: '\\sec^{2} x',
    wrong: [
      '\\frac{-(\\cos^{2} x + \\sin^{2} x)}{\\cos^{2} x} = -\\sec^{2} x',
      '\\frac{\\cos^{2} x - \\sin^{2} x}{\\cos^{2} x} = \\sec^{2} x',
      '\\frac{\\cos^{2} x + \\sin^{2} x}{\\sin^{2} x} = \\csc^{2} x',
    ],
  },
  {
    fn: '\\sec x',
    quotient: '\\frac{1}{\\cos x}',
    substituted: '\\frac{(0)(\\cos x) - (1)(-\\sin x)}{\\cos^{2} x}',
    middle: '\\frac{\\sin x}{\\cos^{2} x}',
    result: '\\sec x \\tan x',
    wrong: [
      '\\frac{-\\sin x}{\\cos^{2} x} = -\\sec x \\tan x',
      '\\frac{\\cos x}{\\sin^{2} x} = \\csc x \\cot x',
      '\\frac{\\sin x}{\\cos x} = \\tan x',
    ],
  },
  {
    fn: '\\csc x',
    quotient: '\\frac{1}{\\sin x}',
    substituted: '\\frac{(0)(\\sin x) - (1)(\\cos x)}{\\sin^{2} x}',
    middle: '\\frac{-\\cos x}{\\sin^{2} x}',
    result: '-\\csc x \\cot x',
    wrong: [
      '\\frac{\\cos x}{\\sin^{2} x} = \\csc x \\cot x',
      '\\frac{-\\sin x}{\\cos^{2} x} = -\\sec x \\tan x',
      '\\frac{-\\cos x}{\\sin x} = -\\cot x',
    ],
  },
];

function generate(v: Record<string, number>): TemplateOutput {
  const proof = PROOFS[v.kind];
  const correct = `${proof.middle} = ${proof.result}`;

  return {
    questionText: 'Write the function as a quotient of sin x and cos x, then use the Quotient Rule. What is the derivative after simplifying?',
    mathExpression: `\\frac{d}{dx}(${proof.fn}) = \\,?`,
    correct,
    distractors: uniqueExcept(proof.wrong, correct),
    optionFormat: 'math',
    steps: [
      { text: 'نكتب الدالة بدلالة sin و cos:', math: `${proof.fn} = ${proof.quotient}` },
      { text: 'نطبق Quotient Rule:', math: `\\frac{d}{dx}\\left(${proof.quotient}\\right) = ${proof.substituted}` },
      { text: 'نبسّط، ونستخدم المتطابقة sin²x + cos²x = 1 عند الحاجة:', math: correct },
    ],
  };
}

export const trigProofTemplate: QuestionTemplate = {
  id: 'derivatives:trig-proof',
  name: 'إثبات مشتقات الدوال المثلثية',
  type: 'derivative',
  difficulty: 'medium',
  variables,
  generate,
};
