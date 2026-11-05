// src/lib/questions/templates/module2.test.ts
// يتأكد رقميًا أن إجابة كل قالب في الموديول الثاني صحيحة، بحساب مستقل عن نص القالب: npm test
import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { getTemplate, type TemplateId } from './registry';

type Scope = Record<string, number>;
type Evaluator = (scope: Scope) => number;

const FUNCTIONS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sec: (x) => 1 / Math.cos(x),
  csc: (x) => 1 / Math.sin(x),
  cot: (x) => 1 / Math.tan(x),
};

/** يحوّل LaTeX البسيط المستخدم في القوالب إلى دالة تحسب قيمته */
function parseLatex(source: string): Evaluator {
  const text = source.replace(/\\left|\\right|\\,|\\quad/g, '').replace(/\s+/g, ' ');
  let i = 0;

  const skip = () => {
    while (text[i] === ' ') i++;
  };
  const eat = (token: string) => {
    skip();
    if (!text.startsWith(token, i)) throw new Error(`توقعت ${token} في: ${text.slice(i)} من ${text}`);
    i += token.length;
  };

  function expression(): Evaluator {
    let left = product();
    for (;;) {
      skip();
      const op = text[i];
      if (op !== '+' && op !== '-') return left;
      i++;
      const a = left;
      const b = product();
      left = op === '+' ? (s) => a(s) + b(s) : (s) => a(s) - b(s);
    }
  }

  function product(): Evaluator {
    skip();
    if (text[i] === '-') {
      i++;
      const inner = product();
      return (s) => -inner(s);
    }
    let left = power();
    for (;;) {
      skip();
      if (text.startsWith('\\cdot', i)) i += 5;
      skip();
      const c = text[i];
      if (c === undefined || c === '+' || c === '-' || c === ')' || c === '}' || c === ']') return left;
      const a = left;
      const b = power();
      left = (s) => a(s) * b(s);
    }
  }

  function power(): Evaluator {
    const base = atom();
    skip();
    if (text[i] !== '^') return base;
    i++;
    const exponent = group();
    return (s) => base(s) ** exponent(s);
  }

  /** ما بعد ^ أو داخل معامل: {…} أو رمز واحد */
  function group(): Evaluator {
    skip();
    if (text[i] === '{') {
      i++;
      const inner = expression();
      eat('}');
      return inner;
    }
    return atom();
  }

  function atom(): Evaluator {
    skip();
    const c = text[i];
    if (c === '(' || c === '[') {
      i++;
      const inner = expression();
      eat(c === '(' ? ')' : ']');
      return inner;
    }
    if (text.startsWith('\\frac', i)) {
      i += 5;
      const top = group();
      const bottom = group();
      return (s) => top(s) / bottom(s);
    }
    if (text.startsWith('\\sqrt', i)) {
      i += 5;
      skip();
      let degree: Evaluator = () => 2;
      if (text[i] === '[') {
        i++;
        degree = expression();
        eat(']');
      }
      const inner = group();
      return (s) => inner(s) ** (1 / degree(s));
    }
    if (text.startsWith('\\theta', i)) {
      i += 6;
      return (s) => s.theta;
    }
    const fn = Object.keys(FUNCTIONS).find((name) => text.startsWith(`\\${name}`, i));
    if (fn) {
      i += fn.length + 1;
      skip();
      let exponent: Evaluator = () => 1;
      if (text[i] === '^') {
        i++;
        exponent = group();
      }
      // زاوية بدون أقواس مثل \sec 6x
      const compact = text.slice(i).match(/^(\d+)([a-z])/);
      if (compact) {
        i += compact[0].length;
        const [coef, name] = [Number(compact[1]), compact[2]];
        return (s) => FUNCTIONS[fn](coef * s[name]) ** exponent(s);
      }
      const arg = power();
      return (s) => FUNCTIONS[fn](arg(s)) ** exponent(s);
    }
    const number = text.slice(i).match(/^\d+(\.\d+)?/);
    if (number) {
      i += number[0].length;
      const value = Number(number[0]);
      return () => value;
    }
    if (c !== undefined && /[a-zA-Z]/.test(c)) {
      i++;
      return (s) => {
        if (!(c in s)) throw new Error(`متغير غير معروف ${c} في ${text}`);
        return s[c];
      };
    }
    throw new Error(`رمز غير متوقع عند: ${text.slice(i)} من ${text}`);
  }

  const result = expression();
  skip();
  if (i !== text.length) throw new Error(`بقي نص بدون قراءة: ${text.slice(i)} من ${text}`);
  return result;
}

const rightSide = (latex: string) => latex.slice(latex.lastIndexOf('=') + 1);

function* samples(id: TemplateId, count = 300) {
  const template = getTemplate(id);
  let made = 0;
  let tries = 0;
  while (made < count && tries < count * 50) {
    tries++;
    const vars: Scope = {};
    for (const def of template.variables) {
      vars[def.name] = def.min + Math.floor(Math.random() * (def.max - def.min + 1));
    }
    if (template.constraint && !template.constraint(vars)) continue;
    made++;
    yield { vars, out: template.generate(vars) };
  }
}

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-4 * Math.max(1, Math.abs(a), Math.abs(b));

function numericDerivative(f: (x: number) => number, x: number) {
  const h = 1e-6;
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** الدالة في mathExpression، ومشتقتها في الإجابة الصحيحة، ولا مشتت يساويها */
function expectDerivativeMatches(id: TemplateId, points: number[]) {
  // كل الأشكال تستخدم متغيرًا واحدًا، واسمه يختلف من شكل لآخر
  const at = (p: number): Scope => ({ x: p, t: p, w: p, theta: p });
  for (const { out } of samples(id, 500)) {
    const f = parseLatex(rightSide(out.mathExpression!));
    const correct = parseLatex(rightSide(out.correct));
    const distractors = out.distractors!.map((d) => parseLatex(rightSide(d)));
    for (const point of points) {
      const exact = numericDerivative((x) => f(at(x)), point);
      expect(close(correct(at(point)), exact), `${out.mathExpression} ⇒ ${out.correct}`).toBe(true);
    }
    for (const [index, distractor] of distractors.entries()) {
      // مقارنة نسبية، لأن القيم قد تكون صغيرة جدًا عند هذه النقاط
      const same = points.every((p) => {
        const [a, b] = [distractor(at(p)), correct(at(p))];
        return Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b));
      });
      expect(same, `مشتت يساوي الإجابة: ${out.distractors![index]} مع ${out.correct}`).toBe(false);
    }
  }
}

const NEW_TEMPLATES: TemplateId[] = [
  'derivatives:power-rules',
  'derivatives:sum-difference',
  'derivatives:product-rule',
  'derivatives:quotient-rule',
  'derivatives:trig-product',
  'derivatives:trig-proof',
  'limits:special-trig',
  'derivatives:general-power',
  'derivatives:chain-trig',
  'derivatives:implicit-cubic',
  'derivatives:implicit-trig',
  'derivatives:particle-motion',
  'derivatives:cube-volume',
  'derivatives:torricelli',
  'derivatives:electric-current',
];

describe('قوالب الموديول الثاني', () => {
  it.each(NEW_TEMPLATES)('%s: كل المعادلات صالحة وفيه 3 مشتتات مختلفة على الأقل', (id) => {
    for (const { out } of samples(id, 150)) {
      expect(new Set(out.distractors).size, out.correct).toBeGreaterThanOrEqual(3);
      expect(out.distractors).not.toContain(out.correct);
      const latex = [out.mathExpression!, out.correct, ...out.distractors!, ...out.steps!.flatMap((s) => (s.math ? [s.math] : []))];
      for (const item of latex) {
        expect(() => katex.renderToString(item, { throwOnError: true, strict: 'ignore' }), item).not.toThrow();
      }
      expect(latex.join(' '), latex.join(' ')).not.toMatch(/--|\+ -|- -|NaN|undefined|Infinity|\b1x\b|\b0x\b/);
    }
  });

  it.each(NEW_TEMPLATES)('%s: كل شكل يظهر عند التوليد العشوائي', (id) => {
    const template = getTemplate(id);
    const form = template.variables.find((def) => def.name === 'form');
    const seen = new Set<number>();
    for (const { vars } of samples(id, 300)) seen.add(vars.form);
    if (form) expect(seen.size, id).toBe(form.max - form.min + 1);
  });

  it('1.1 Power Rules', () => expectDerivativeMatches('derivatives:power-rules', [1.3, 2.7]));
  it('1.2 Sum and Difference', () => expectDerivativeMatches('derivatives:sum-difference', [1.3, 2.7]));
  it('1.3 Product Rule', () => expectDerivativeMatches('derivatives:product-rule', [0.7, 1.9]));
  it('1.4 Quotient Rule', () => expectDerivativeMatches('derivatives:quotient-rule', [0.7, 1.9]));
  it('2.1 Trig', () => expectDerivativeMatches('derivatives:trig-product', [0.5, 0.9]));
  it('3.1 General Power', () => expectDerivativeMatches('derivatives:general-power', [1.05, 1.2]));
  it('3.2 Chain Trig', () => expectDerivativeMatches('derivatives:chain-trig', [0.31, 0.47]));

  it('2.2 Trig Proof: الناتج مشتقة الدالة فعلًا، والكسر يساويه', () => {
    const functions = { '\\cot x': FUNCTIONS.cot, '\\tan x': FUNCTIONS.tan, '\\sec x': FUNCTIONS.sec, '\\csc x': FUNCTIONS.csc };
    for (let kind = 0; kind <= 3; kind++) {
      const out = getTemplate('derivatives:trig-proof').generate({ kind });
      const name = Object.keys(functions).find((key) => out.mathExpression!.includes(key)) as keyof typeof functions;
      const [middle, result] = out.correct.split('=').map(parseLatex);
      for (const x of [0.4, 1.1]) {
        const exact = numericDerivative(functions[name], x);
        expect(close(result({ x }), exact), out.correct).toBe(true);
        expect(close(middle({ x }), exact), out.correct).toBe(true);
      }
      for (const wrong of out.distractors!) {
        const [left] = wrong.split('=').map(parseLatex);
        expect(close(left({ x: 0.4 }), numericDerivative(functions[name], 0.4)), wrong).toBe(false);
      }
    }
  });

  it('2.3 Special Limits: تطابق حساب النهاية قرب الصفر', () => {
    for (const { vars, out } of samples('limits:special-trig')) {
      const { a, b, form } = vars;
      const x = 1e-5;
      const exact =
        form === 0 ? Math.sin(a * x) / (b * x)
        : form === 1 ? Math.sin(a * x) ** 2 / (b * x)
        : Math.sin(x) / (x + a * Math.tan(x));
      expect(Math.abs(parseLatex(out.correct)({}) - exact), out.mathExpression).toBeLessThan(1e-3);
    }
  });

  it('4.1 Implicit: y\' = -F_x / F_y والمماس يمر بالنقطة بنفس الميل', () => {
    for (const { vars, out } of samples('derivatives:implicit-cubic')) {
      if (vars.form === 1) {
        const [, x0, y0] = out.questionText.match(/\((\d+), (\d+)\)/)!.map(Number);
        const [, a, b, k] = out.correct.match(/(\d+)x \+ (\d+)y = (\d+)/)!.map(Number);
        const r2 = Number(rightSide(out.mathExpression!));
        expect(x0 * x0 + y0 * y0, 'النقطة على الدائرة').toBe(r2);
        expect(a * x0 + b * y0, out.correct).toBe(k);
        expect(close(-a / b, -x0 / y0), out.correct).toBe(true);
        continue;
      }
      const k = 3 * vars.c;
      const correct = parseLatex(rightSide(out.correct));
      for (const [x, y] of [[1.3, 2.1], [0.7, -1.4]]) {
        const Fx = 3 * x * x - k * y;
        const Fy = 3 * y * y - k * x;
        expect(close(correct({ x, y }), -Fx / Fy), out.correct).toBe(true);
      }
    }
  });

  it('4.2 Implicit Trig: y\' = -F_x / F_y و g\'(0) من المعادلة', () => {
    for (const { vars, out } of samples('derivatives:implicit-trig')) {
      const { kind, a, b } = vars;
      if (kind === 2) {
        // نحل g(x) + a x sin g(x) = x² + b x رقميًا قرب الصفر
        const solve = (x: number) => {
          let g = 0;
          for (let n = 0; n < 50; n++) {
            const f = g + a * x * Math.sin(g) - x * x - b * x;
            g -= f / (1 + a * x * Math.cos(g));
          }
          return g;
        };
        const exact = numericDerivative(solve, 0);
        expect(close(parseLatex(rightSide(out.correct))({}), exact), out.correct).toBe(true);
        continue;
      }
      const correct = parseLatex(rightSide(out.correct));
      for (const [x, y] of [[0.6, 0.9], [1.2, 0.3]]) {
        const exact = kind === 0
          ? -(Math.cos(x) - a) / (-Math.sin(y) + b)
          : -(Math.cos(x + y) + a * y * y * Math.sin(x)) / (Math.cos(x + y) - 2 * a * y * Math.cos(x));
        expect(close(correct({ x, y }), exact), out.correct).toBe(true);
      }
    }
  });

  it('5.1 Particle Motion: v = 0 عند الجذرين، وموجبة خارجهما', () => {
    for (const { vars, out } of samples('derivatives:particle-motion')) {
      const { p, q, T, form } = vars;
      const s = parseLatex(rightSide(out.mathExpression!));
      const v = (t: number) => numericDerivative((u) => s({ t: u }), t);
      if (form === 1) {
        const parts = out.correct.match(/v\(t\) = (.+),\\quad .*v\(\d+\) = (-?\d+)\\ /)!;
        const velocity = parseLatex(parts[1]);
        expect(close(velocity({ t: 2.3 }), v(2.3)), out.correct).toBe(true);
        expect(close(Number(parts[2]), v(T)), out.correct).toBe(true);
        continue;
      }
      expect(Math.abs(v(p))).toBeLessThan(1e-4);
      expect(Math.abs(v(q))).toBeLessThan(1e-4);
      expect(v((p + q) / 2)).toBeLessThan(0);
      expect(v(p - 0.5)).toBeGreaterThan(0);
      expect(v(q + 0.5)).toBeGreaterThan(0);
      expect(out.correct).toContain(`t = ${p}, ${q}`);
      expect(out.correct).toContain(`t < ${p} \\text{ or } t > ${q}`);
    }
  });

  it('5.2 Cube Volume', () => {
    for (const { vars, out } of samples('derivatives:cube-volume')) {
      const exact = numericDerivative((x) => x ** 3, vars.a);
      expect(close(parseFloat(out.correct), exact), out.correct).toBe(true);
    }
  });

  it('5.3 Torricelli', () => {
    const times = [16, 24, 40, 80];
    for (const { vars, out } of samples('derivatives:torricelli')) {
      const T = times[vars.timeIndex];
      if (vars.form === 1) {
        // مقدار المعدل يقل كلما زاد الزمن، فالأسرع t = 0 والأبطأ t = T
        const V = (u: number) => 25 * vars.k * T * (1 - u / T) ** 2;
        expect(Math.abs(numericDerivative(V, 1e-3))).toBeGreaterThan(Math.abs(numericDerivative(V, T / 2)));
        expect(Math.abs(numericDerivative(V, T - 1e-3))).toBeLessThan(Math.abs(numericDerivative(V, T / 2)));
        expect(out.correct).toBe(`\\text{fastest: } t = 0,\\quad \\text{slowest: } t = ${T}`);
        continue;
      }
      const V0 = 25 * vars.k * T;
      const t = (vars.part * T) / 8;
      const exact = numericDerivative((u) => V0 * (1 - u / T) ** 2, t);
      expect(Math.abs(parseFloat(out.correct) - exact), out.correct).toBeLessThan(0.01);
      expect(parseFloat(out.correct)).toBeLessThan(0);
    }
  });

  it('5.4 Electric Current', () => {
    for (const { vars, out } of samples('derivatives:electric-current')) {
      const { a, b, c, T } = vars;
      const Q = (t: number) => t ** 3 - a * t ** 2 + b * t + c;
      const I = (t: number) => numericDerivative(Q, t);
      const match = out.correct.match(/\(a\) \} (-?\d+)\\ \\text\{A\},\\quad \\text\{\(b\) \} t = (.+)\\ \\text\{s\}/)!;
      expect(close(Number(match[1]), I(T)), out.correct).toBe(true);
      const lowest = parseLatex(match[2])({});
      expect(close(lowest, a / 3), out.correct).toBe(true);
      expect(I(lowest)).toBeLessThan(I(lowest + 0.1));
      expect(I(lowest)).toBeLessThan(I(Math.abs(lowest - 0.1)));
      expect(I(lowest)).toBeGreaterThan(0);
    }
  });
});
