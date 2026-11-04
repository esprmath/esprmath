import { generateOne, generateMany } from '../src/lib/questions/engine/generator';
import { validateQuestion } from '../src/lib/questions/engine/validator';
import { rationalSignTemplate } from '../src/lib/questions/templates/limits/rational-sign';

const cfg = { templateId: 'limits:rational-sign', count: 5 } as const;

// 1) معاينة 5 أسئلة بعينك
console.log('--- معاينة ---');
for (const q of generateMany(cfg, 1)) {
  console.log(q.mathExpression);
  console.log(q.options.map(o => `${o.id}) ${o.text}`).join('   '));
  console.log('الصحيح:', q.correctId, '\n');
}

// 2) نفس الـ seed = نفس السؤال
const same = JSON.stringify(generateOne(cfg, 42)) === JSON.stringify(generateOne(cfg, 42));
console.log('ثبات الـ seed:', same ? '✅' : '❌');

// 3) 500 سؤال تمر على الـ validator
let bad = 0;
for (let s = 1; s <= 500; s++) {
  const r = validateQuestion(generateOne(cfg, s));
  if (r.errors.length) { bad++; console.log(`❌ seed ${s}:`, r.errors); }
}
console.log(bad === 0 ? '✅ 500 سؤال كلها صالحة' : `❌ ${bad} أسئلة فيها أخطاء`);

// 4) الجواب الرياضي صحيح (بالتعويض العددي، مستقل عن القالب)
let wrong = 0;
for (let a = -9; a <= 9; a++) {
  if (a === 0) continue;
  for (let b = -5; b <= 5; b++) {
    for (const direction of [0, 1]) {
      const out = rationalSignTemplate.generate({ numerator: a, asymptote: b, direction });
      const x = b + (direction === 1 ? 1e-6 : -1e-6);
      const expected = a / (x - b) > 0 ? '\\infty' : '-\\infty';
      if (out.correct !== expected) { wrong++; console.log(`❌ a=${a} b=${b} dir=${direction}`); }
    }
  }
}
console.log(wrong === 0 ? '✅ كل الإجابات صحيحة رياضيًا' : `❌ ${wrong} إجابات غلط`);