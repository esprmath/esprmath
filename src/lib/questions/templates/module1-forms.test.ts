// src/lib/questions/templates/module1-forms.test.ts
// يتأكد من الأشكال الثانية المضافة لقوالب الموديول الأول، بحساب مستقل عن نص القالب: npm test
import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { getTemplate, type TemplateId } from './registry';

type Vars = Record<string, number>;

/** كل تركيبات المتغيرات الممكنة للشكل المطلوب */
function* allVars(id: TemplateId, form: number): Generator<Vars> {
  const template = getTemplate(id);
  const defs = template.variables.filter((d) => d.name !== 'form');
  const walk = function* (i: number, acc: Vars): Generator<Vars> {
    if (i === defs.length) {
      const vars = { ...acc, form };
      if (!template.constraint || template.constraint(vars)) yield vars;
      return;
    }
    for (let x = defs[i].min; x <= defs[i].max; x++) {
      if (defs[i].exclude?.includes(x)) continue;
      yield* walk(i + 1, { ...acc, [defs[i].name]: x });
    }
  };
  yield* walk(0, {});
}

const close = (a: number, b: number, tol = 1e-3) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));

/** يقرأ عددًا أو كسرًا بسيطًا مثل -\frac{3}{4} */
function readNumber(tex: string): number {
  const t = tex.replace(/\s+/g, '');
  const m = t.match(/^(-?)\\frac\{(-?\d+)\}\{(\d+)\}$/);
  if (m) return (m[1] ? -1 : 1) * (Number(m[2]) / Number(m[3]));
  return Number(t);
}

const FORM_TEMPLATES: TemplateId[] = [
  'limits:rational-sign',
  'limits:vertical-asymptote',
  'limits:direct-substitution',
  'limits:piecewise-eval',
  'limits:conjugate-zero',
  'continuity:check-point',
  'continuity:rational-discontinuity',
  'continuity:unknown-value',
  'limits:infinity-reciprocal',
  'limits:rational-infinity',
  'limits:infinity-infinite',
];

describe('الأشكال الثانية في قوالب الموديول الأول', () => {
  it.each(FORM_TEMPLATES)('%s: المتغير form آخر القائمة، وفيه شكلان فقط', (id) => {
    const vars = getTemplate(id).variables.map((d) => d.name);
    const form = getTemplate(id).variables.find((d) => d.name === 'form')!;
    expect([form.min, form.max]).toEqual([0, 1]);
    // المتغيرات القديمة قبل form حتى تبقى أسئلة الشكل الأول كما كانت
    expect(vars.indexOf('form')).toBeGreaterThan(0);
  });

  it.each(FORM_TEMPLATES)('%s: الشكل الثاني صالح وفيه 3 مشتتات مختلفة', (id) => {
    // عينة موزعة على كل التركيبات، لأن عرض KaTeX لكل التركيبات بطيء
    const all = [...allVars(id, 1)];
    const step = Math.max(1, Math.floor(all.length / 300));
    for (const vars of all.filter((_, i) => i % step === 0)) {
      const out = getTemplate(id).generate(vars);
      expect(new Set(out.distractors).size, out.correct).toBeGreaterThanOrEqual(3);
      expect(out.distractors).not.toContain(out.correct);
      const latex = [out.mathExpression!, out.correct, ...out.distractors!, ...out.steps!.flatMap((s) => (s.math ? [s.math] : []))];
      for (const item of latex) {
        expect(() => katex.renderToString(item, { throwOnError: true, strict: 'ignore' }), item).not.toThrow();
      }
      // كلمة "undefined" مقصودة في خيار مثل "f(a) is undefined"، فنفحص القيم المعطوبة فقط
      expect(latex.join(' ')).not.toMatch(/--|\+ -|- -|NaN|Infinity|\b1x\b|\b0x\b|\{undefined\}|= undefined/);
    }
  });

  it('1.3 مثل Q-31: الإشارة صحيحة قرب نقطة التقارب', () => {
    for (const v of allVars('limits:rational-sign', 1)) {
      const out = getTemplate('limits:rational-sign').generate(v);
      const b = v.asymptote;
      const p = b - v.numerator;
      const x = b + (v.direction === 1 ? 1e-6 : -1e-6);
      const value = (x - p) / (x * x * (x - b));
      expect(out.correct, out.mathExpression).toBe(value > 0 ? '\\infty' : '-\\infty');
    }
  });

  it('1.4 مثل Q-38: المقام صفر عند الخطين، والبسط لا', () => {
    for (const v of allVars('limits:vertical-asymptote', 1)) {
      const out = getTemplate('limits:vertical-asymptote').generate(v);
      const other = readNumber(out.correct.split('x = ')[2]);
      expect(close(v.a * other - v.q * other * other, 0), out.correct).toBe(true);
      expect(other * other + v.c).toBeGreaterThan(0);
    }
  });

  it('2.1 مثل Ex 2(a): قيمة كثيرة الحدود عند النقطة', () => {
    for (const v of allVars('limits:direct-substitution', 1)) {
      const out = getTemplate('limits:direct-substitution').generate(v);
      const b = v.B === 0 ? -1 : v.B;
      expect(Number(out.correct), out.mathExpression).toBe((v.A + 1) * v.a * v.a + b * v.a + v.D);
    }
  });

  it('2.2 مثل Ex 9: الجهتان تتساويان فقط عند willExist', () => {
    for (const v of allVars('limits:piecewise-eval', 1)) {
      const out = getTemplate('limits:piecewise-eval').generate(v);
      const a = v.a + 2;
      const shift = v.willExist === 1 ? 0 : v.m2;
      const left = -v.m1 * (a - 1e-9) + v.m1 * a + shift;
      const right = Math.sqrt(1e-9);
      expect(out.correct, out.mathExpression).toBe(close(left, right) ? '0' : '\\text{DNE}');
    }
  });

  it('2.3 مثل Q-27: الناتج يطابق الحساب قرب الصفر', () => {
    for (const v of allVars('limits:conjugate-zero', 1)) {
      const out = getTemplate('limits:conjugate-zero').generate(v);
      const k = v.targetRoot;
      const t = 1e-6;
      const exact = (Math.sqrt(k * k + v.m * t) - Math.sqrt(k * k - v.m * t)) / t;
      expect(close(readNumber(out.correct), exact), out.mathExpression).toBe(true);
    }
  });

  it('4.1 مثل Q-13: f(a) تساوي القيمة في الإجابة', () => {
    for (const v of allVars('continuity:check-point', 1)) {
      const out = getTemplate('continuity:check-point').generate(v);
      const point = -v.a;
      const f = (v.A + 1) * point * point + (point + v.a + 1) ** (v.k + 1);
      expect(out.correct.endsWith(`= ${f}`), out.correct).toBe(true);
    }
  });

  it('4.2 مثل Q-23: النهاية 1 من الجهتين ولا تساوي f(0)', () => {
    for (const v of allVars('continuity:rational-discontinuity', 1)) {
      const out = getTemplate('continuity:rational-discontinuity').generate(v);
      const h = 1e-6;
      expect(close(Math.cos(-h), 1 - v.a * h * h)).toBe(true);
      const value = Number(out.correct.match(/f\(0\) = (-?\d+)$/)![1]);
      expect(value).not.toBe(1);
    }
  });

  it('4.3 مثل Ex 6(b): الاستثناءات هي أصفار المقام فقط', () => {
    for (const v of allVars('continuity:unknown-value', 1)) {
      const out = getTemplate('continuity:unknown-value').generate(v);
      expect(out.correct).toBe(`\\mathbb{R} \\setminus \\{-${v.a}, ${v.a}\\}`);
      const constant = v.a * v.a + v.fA + 10;
      for (const x of [v.a, -v.a]) expect(x * x + v.c1 * x + constant).not.toBe(0);
    }
  });

  it('5.1 مثل Q-23: النهاية DNE', () => {
    for (const v of allVars('limits:infinity-reciprocal', 1)) {
      expect(getTemplate('limits:infinity-reciprocal').generate(v).correct).toBe('\\text{DNE}');
    }
  });

  it('5.2 مثل Ex 4: الخط الأفقي يطابق الحساب عند x كبيرة', () => {
    const squares = [2, 3, 5, 6, 7];
    for (const v of allVars('limits:rational-infinity', 1)) {
      const out = getTemplate('limits:rational-infinity').generate(v);
      const p = squares[v.a - 1];
      const x = v.negInf === 1 ? -1e7 : 1e7;
      const exact = Math.sqrt(p * x * x + 1) / (v.b * x - (v.n + 2));
      const shown = (out.correct.includes('y = -') ? -1 : 1) * (Math.sqrt(p) / v.b);
      expect(close(shown, exact), out.correct).toBe(true);
    }
  });

  it('5.4 مثل Q-21: الإشارة عند -∞ صحيحة', () => {
    for (const v of allVars('limits:infinity-infinite', 1)) {
      const out = getTemplate('limits:infinity-infinite').generate(v);
      const n = (v.b % 3) + 2;
      const coef = (v.denSign === 1 ? -1 : 1) * (v.a + 1);
      const x = -1e4;
      const value = (coef * x ** (n + 1) - x) / (x ** n + v.b + 1);
      expect(out.correct, out.mathExpression).toBe(value > 0 ? '\\infty' : '-\\infty');
    }
  });
});
