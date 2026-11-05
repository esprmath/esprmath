// scripts/check-templates.ts
import { getAllTemplates } from '../src/lib/questions/templates/registry';
import { generateOne } from '../src/lib/questions/engine/generator';
import { validateQuestion } from '../src/lib/questions/engine/validator';
import { DNE } from '../src/lib/questions/templates/utils';

// استيراد القوالب المحددة للفحوصات الرياضية العميقة
import { conjugateZeroTemplate } from '../src/lib/questions/templates/limits/conjugate-zero';
import { directSubstitutionTemplate } from '../src/lib/questions/templates/limits/direct-substitution';
import { unknownFunctionTemplate } from '../src/lib/questions/templates/limits/unknown-function';
import { piecewiseEvalTemplate, buildPiecewise } from '../src/lib/questions/templates/limits/piecewise-eval';
import { instantaneousVelocityTemplate } from '../src/lib/questions/templates/derivatives/instantaneous-velocity';
import { tangentLimitTemplate } from '../src/lib/questions/templates/derivatives/tangent-limit';
import { conjugateInfinityTemplate } from '../src/lib/questions/templates/limits/conjugate-infinity';
import { infinityInfiniteTemplate } from '../src/lib/questions/templates/limits/infinity-infinite';
import { infinityReciprocalTemplate } from '../src/lib/questions/templates/limits/infinity-reciprocal';
import { rationalInfinityTemplate } from '../src/lib/questions/templates/limits/rational-infinity';

// ============================================================================
// 1. دوال مساعدة (Utilities)
// ============================================================================

function latexToNumber(s: string): number {
  const m = s.match(/^(-?)(?:(\d+)|\\frac\{(\d+)\}\{(\d+)\})$/);
  if (!m) throw new Error(`لا أستطيع تحويل: ${s}`);
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (m[2] !== undefined ? Number(m[2]) : Number(m[3]) / Number(m[4]));
}

function parseLine(s: string): { slope: number; c: number } {
  const m = s.match(/^y = (-?)(?:\\frac\{(\d+)\}\{(\d+)\}|(\d+))?x(?: ([+-]) (\d+))?$/);
  if (!m) throw new Error(`لا أستطيع تحويل المعادلة: ${s}`);
  const sign = m[1] === '-' ? -1 : 1;
  const mag = m[2] !== undefined ? Number(m[2]) / Number(m[3]) : m[4] !== undefined ? Number(m[4]) : 1;
  const c = m[6] !== undefined ? (m[5] === '-' ? -1 : 1) * Number(m[6]) : 0;
  return { slope: sign * mag, c };
}

function readGroup(s: string, i: number): [string, number] {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}') {
      depth--;
      if (depth === 0) return [s.slice(i + 1, j), j + 1];
    }
  }
  throw new Error(`أقواس غير متطابقة: ${s}`);
}

function texToJs(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; ) {
    if (s.startsWith('\\frac', i)) {
      const [n, j] = readGroup(s, i + 5);
      const [d, k] = readGroup(s, j);
      out += `((${texToJs(n)})/(${texToJs(d)}))`;
      i = k;
    } else if (s.startsWith('\\sqrt', i)) {
      const [r, j] = readGroup(s, i + 5);
      out += `Math.sqrt(${texToJs(r)})`;
      i = j;
    } else if (s.startsWith('\\left', i)) i += 5;
    else if (s.startsWith('\\right', i)) i += 6;
    else if (s[i] === '^') {
      if (s[i + 1] === '{') {
        const [e, j] = readGroup(s, i + 1);
        out += `**(${texToJs(e)})`;
        i = j;
      } else {
        out += `**${s[i + 1]}`;
        i += 2;
      }
    } else if (s[i] === ' ') i++;
    else out += s[i++];
  }
  return out;
}

function evalTex(tex: string, x: number): number {
  try {
    const body = tex.replace(/^\s*\\lim_\{[^}]*\}/, '');
    const js = texToJs(body)
      .replace(/(\d)x/g, '$1*x')
      .replace(/(\d|\))\(/g, '$1*(')
      .replace(/x\(/g, 'x*(')
      .replace(/\)x/g, ')*x');
    return new Function('x', `return ${js};`)(x) as number;
  } catch {
    return NaN; // فشل التحليل
  }
}

// ============================================================================
// 2. دالة التشغيل الرئيسية
// ============================================================================

function runChecks() {
  console.log("🚀 بدء فحص القوالب الشامل...\n");
  let totalBad = 0;

  // ----------------------------------------------------------------------------
  // القسم الأول: التحقق من البنية (Validator) لكل القوالب
  // ----------------------------------------------------------------------------
  console.log("📌 1. فحص البنية (500 Seed لكل قالب):");
  for (const t of getAllTemplates()) {
    let errors = 0;
    let warnings = 0;
    for (let seed = 1; seed <= 500; seed++) {
      const r = validateQuestion(generateOne({ templateId: t.id }, seed));
      warnings += r.warnings.length;
      if (r.errors.length) {
        errors++;
        if (errors <= 3) console.log(`   ❌ ${t.id} seed ${seed}:`, r.errors);
      }
    }
    console.log(errors === 0 ? `   ✅ ${t.id}: 500 سؤال صالح` : `   ❌ ${t.id}: ${errors} أسئلة فيها أخطاء`, `(تحذيرات: ${warnings})`);
    if (errors > 0) totalBad += errors;
  }
  console.log("");

  // ----------------------------------------------------------------------------
  // القسم الثاني: الفحص الرياضي العميق (Mathematical Correctness)
  // ----------------------------------------------------------------------------
  console.log("📌 2. الفحص الرياضي العميق:");

  // 2.1 Conjugate Zero
  let bad = 0;
  for (let a = 1; a <= 4; a++)
    for (let m = 1; m <= 5; m++)
      for (let t = 2; t <= 4; t++)
        for (const flipNum of [0, 1])
          for (const flipDen of [0, 1]) {
            const out = conjugateZeroTemplate.generate({ a, m, targetRoot: t, flipNum, flipDen });
            const f = evalTex(out.mathExpression!, a + 1e-6);
            if (Math.abs(f - latexToNumber(out.correct)) > 1e-4) {
              bad++;
            }
          }
  console.log(bad === 0 ? '   ✅ conjugate-zero: كل الإجابات صحيحة رياضيًا' : `   ❌ conjugate-zero: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.2 Direct Substitution
  bad = 0;
  for (let a = -3; a <= 3; a++) {
    if (a === 0) continue;
    for (let A = 1; A <= 5; A++)
      for (let B = -5; B <= 5; B++)
        for (let C = 1; C <= 3; C++)
          for (let D = 1; D <= 5; D++) {
            const den = C * a + D;
            if (den === 0) continue;
            const out = directSubstitutionTemplate.generate({ a, A, B, C, D });
            if (Math.abs((A * a + B) / den - latexToNumber(out.correct)) > 1e-9) bad++;
          }
  }
  console.log(bad === 0 ? '   ✅ direct-substitution: كل الإجابات صحيحة رياضيًا' : `   ❌ direct-substitution: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.3 Unknown Function
  bad = 0;
  for (let a = 1; a <= 5; a++)
    for (let A = 2; A <= 10; A++)
      for (let L = 2; L <= 8; L++) {
        const out = unknownFunctionTemplate.generate({ a, A, L });
        const f = (x: number) => A + L * (x - a);
        if (Math.abs(f(a + 1e-9) - latexToNumber(out.correct)) > 1e-6) bad++;
      }
  console.log(bad === 0 ? '   ✅ unknown-function: كل الإجابات صحيحة رياضيًا' : `   ❌ unknown-function: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.4 Piecewise Eval
  bad = 0;
  for (let a = 1; a <= 4; a++)
    for (let m1 = 1; m1 <= 4; m1++)
      for (let c1 = -5; c1 <= 5; c1++)
        for (let m2 = 1; m2 <= 4; m2++)
          for (const willExist of [0, 1]) {
            const v = { a, m1, c1, m2, willExist };
            const out = piecewiseEvalTemplate.generate(v);
            const { c2 } = buildPiecewise(v);
            const eps = 1e-6;
            const left = m1 * (a - eps) + c1;
            const right = m2 * (a + eps) + c2;
            const exists = Math.abs(left - right) < 1e-4;
            const ok = exists
              ? out.correct !== DNE && Math.abs(latexToNumber(out.correct) - left) < 1e-4
              : out.correct === DNE;
            if (!ok) bad++;
          }
  console.log(bad === 0 ? '   ✅ piecewise-eval: كل الإجابات صحيحة رياضيًا' : `   ❌ piecewise-eval: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.5 Conjugate Infinity
  bad = 0;
  for (let b = 2; b <= 8; b++)
    for (let c = 5; c <= 20; c++) {
      const out = conjugateInfinityTemplate.generate({ b, c });
      const f = evalTex(out.mathExpression!, 1e6);
      if (Math.abs(f - latexToNumber(out.correct)) > 1e-3) bad++;
    }
  console.log(bad === 0 ? '   ✅ conjugate-infinity: كل الإجابات صحيحة رياضيًا' : `   ❌ conjugate-infinity: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.6 Infinity Infinite
  bad = 0;
  for (let a = 1; a <= 5; a++)
    for (let b = 1; b <= 5; b++)
      for (const denSign of [0, 1]) {
        const out = infinityInfiniteTemplate.generate({ a, b, denSign });
        const f = evalTex(out.mathExpression!, 1e6);
        const expected = f > 0 ? '\\infty' : '-\\infty';
        if (out.correct !== expected) bad++;
      }
  console.log(bad === 0 ? '   ✅ infinity-infinite: كل الإجابات صحيحة رياضيًا' : `   ❌ infinity-infinite: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.7 Infinity Reciprocal
  bad = 0;
  for (let k = 1; k <= 9; k++)
    for (let n = 1; n <= 4; n++)
      for (const isNegInf of [0, 1]) {
        const out = infinityReciprocalTemplate.generate({ k, n, isNegInf });
        const f = evalTex(out.mathExpression!, isNegInf ? -1e6 : 1e6);
        if (out.correct !== '0' || Math.abs(f) > 1e-3) bad++;
      }
  console.log(bad === 0 ? '   ✅ infinity-reciprocal: كل الإجابات صحيحة رياضيًا' : `   ❌ infinity-reciprocal: ${bad} إجابات غلط`);
  totalBad += bad;

  // 2.8 Rational Infinity
  bad = 0;
  for (let a = 1; a <= 5; a++)
    for (let b = 2; b <= 6; b++)
      for (let n = 1; n <= 3; n++) {
        const out = rationalInfinityTemplate.generate({ a, b, n });
        const f = evalTex(out.mathExpression!, 1e6);
        if (Math.abs(f - latexToNumber(out.correct)) > 1e-4) bad++;
      }
  console.log(bad === 0 ? '   ✅ rational-infinity: كل الإجابات صحيحة رياضيًا' : `   ❌ rational-infinity: ${bad} إجابات غلط`);
  totalBad += bad;

  console.log("");

  // ----------------------------------------------------------------------------
  // القسم الثالث: الفحص الفيزيائي والتفاضلي (Domain-Specific)
  // ----------------------------------------------------------------------------
  console.log("📌 3. الفحص الفيزيائي والتفاضلي:");

  // 3.1 Instantaneous Velocity
  bad = 0;
  const BAD_PATTERNS = [/--/, /\+ -/, /- -/, /\b1x\b/, /\b0x\b/, /\+ 0\b/, /- 0\b/, /\\frac\{[^}0][^}]*\}\{0\}/, /\\frac\{[^}]*\}\{1\}/, /NaN|undefined|Infinity/];
  
  for (let t = 2; t <= 5; t++)
    for (let m = 3; m <= 7; m++) {
      if (t >= m) continue;
      const out = instantaneousVelocityTemplate.generate({ t, m });
      const nums = out.correct.match(/\(a\)[^\d-]*(-?[\d.]+)[\s\S]*?\(b\)[^\d-]*(-?[\d.]+)/);
      const hMatch = out.questionText.match(/(\d+(?:\.\d+)?)\s*m above/);
      if (!nums || !hMatch) {
        bad++;
        continue;
      }
      const h = Number(hMatch[1]);
      const a = Number(nums[1]);
      const b = Number(nums[2]);
      const okA = Math.abs(a + 9.8 * t) < 1e-9;
      const okB = Math.abs(b - Math.sqrt(2 * 9.8 * h)) < 1e-6;
      const landsAfterT = t < Math.sqrt((2 * h) / 9.8);
      if (!okA || !okB || !landsAfterT) bad++;
    }
  console.log(bad === 0 ? '   ✅ instantaneous-velocity: كل الإجابات صحيحة فيزيائيًا' : `   ❌ instantaneous-velocity: ${bad} إجابات غلط`);
  totalBad += bad;

  // 3.2 Tangent Limit
  bad = 0;
  for (let a = 1; a <= 4; a++)
    for (let yVal = 1; yVal <= 5; yVal++) {
      const out = tangentLimitTemplate.generate({ a, yVal });
      const k = a * yVal;
      const slope = -k / (a * a);
      const c = yVal - slope * a;
      try {
        const got = parseLine(out.correct);
        if (Math.abs(got.slope - slope) > 1e-9 || Math.abs(got.c - c) > 1e-9) bad++;
      } catch {
        bad++; // فشل في تحليل الصياغة
      }
    }
  console.log(bad === 0 ? '   ✅ tangent-limit: كل الإجابات صحيحة رياضيًا' : `   ❌ tangent-limit: ${bad} إجابات غلط`);
  totalBad += bad;

  console.log("");

  // ----------------------------------------------------------------------------
  // القسم الرابع: فحص نظافة الصياغة (Syntax & Formatting)
  // ----------------------------------------------------------------------------
  console.log("📌 4. فحص نظافة الصياغة (Bad Patterns):");
  for (const t of getAllTemplates()) {
    const hits = new Set<string>();
    for (let seed = 1; seed <= 300; seed++) {
      const q = generateOne({ templateId: t.id }, seed);
      const texts = [
        q.mathExpression ?? '',
        ...q.options.map((o) => o.text),
        ...(q.steps ?? []).flatMap((s) => [s.text, s.math ?? '']),
      ];
      for (const s of texts) {
        const clean = s.replace(/\\text\{[^}]*\}/g, '');
        for (const re of BAD_PATTERNS) {
          if (re.test(clean)) hits.add(`${re.source} ← ${s}`);
        }
      }
    }
    if (hits.size === 0) {
      console.log(`   ✅ ${t.id}: الصياغة نظيفة`);
    } else {
      console.log(`   ❌ ${t.id}: ${hits.size} مشاكل صياغة`);
      [...hits].slice(0, 3).forEach((h) => console.log(`      ⚠️ ${h}`));
      totalBad += hits.size;
    }
  }

  console.log("\n" + "=".repeat(60));
  if (totalBad === 0) {
    console.log("🎉 ممتاز! جميع القوالب اجتازت الفحوصات بنجاح 100%.");
  } else {
    console.log(`⚠️ تم العثور على ${totalBad} مشكلة. يرجى مراجعة الأخطاء أعلاه.`);
  }
  console.log("=".repeat(60));
}

// تشغيل الفحوصات
runChecks();