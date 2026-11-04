// scripts/test-templates.ts
import { generateOne } from '../src/lib/questions/engine/generator';
import { validateQuestion } from '../src/lib/questions/engine/validator';
import { getAllTemplates } from '../src/lib/questions/templates/registry';
import type { TemplateId } from '../src/lib/questions/templates/registry';

const TEST_COUNT = 100;

interface FailRecord {
  templateId: string;
  seed: number;
  error: string;
  question?: any;
}

// ✅ دالة لتبسيط الكسور ومقارنتها رياضياً
function normalizeLatex(latex: string): string {
  // إزالة المسافات
  let normalized = latex.replace(/\s+/g, '');
  
  // معالجة الكسور: \frac{a}{b} -> a/b
  normalized = normalized.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  
  // معالجة الأرقام السالبة: -\frac{a}{b} -> -(a/b)
normalized = normalized.replace(new RegExp('-\\\\frac', 'g'), '-');  // ✅ صحيح  
  // تبسيط الكسور: (2)/(4) -> (1)/(2)
  normalized = normalized.replace(/\((-?\d+)\)\/\((-?\d+)\)/g, (_, num, den) => {
    const n = parseInt(num);
    const d = parseInt(den);
    if (d === 0) return `${n}/${d}`;
    const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, Math.abs(a % b)));
    const divisor = gcd(Math.abs(n), Math.abs(d));
    const sNum = n / divisor;
    const sDen = d / divisor;
    if (sDen < 0) return `(${ -sNum })/(${ -sDen })`;
    if (sDen === 1) return `${sNum}`;
    return `(${sNum})/(${sDen})`;
  });
  
  return normalized;
}

function runTests() {
  const templates = getAllTemplates();
  const allFails: FailRecord[] = [];
  const summary: Record<string, { pass: number; fail: number }> = {};

  console.log(' بدء اختبار القوالب مع فحص رياضي...\n');

  for (const template of templates) {
    let pass = 0;
    let fail = 0;

    for (let seed = 1; seed <= TEST_COUNT; seed++) {
      try {
        const config = { templateId: template.id as TemplateId, count: 1 };
        const question = generateOne(config, seed);

        const validation = validateQuestion(question);
        if (validation.errors.length > 0) {
          allFails.push({
            templateId: template.id,
            seed,
            error: `أخطاء بنية: ${validation.errors.join(' | ')}`,
            question,
          });
          fail++;
          continue;
        }

        const correctOption = question.options.find(o => o.id === question.correctId);
        if (!correctOption) {
          allFails.push({
            templateId: template.id,
            seed,
            error: 'الإجابة الصحيحة (correctId) غير موجودة في الخيارات',
            question,
          });
          fail++;
          continue;
        }

        // ✅ فحص رياضي: التأكد من أن الإجابة الصحيحة لا تتطابق رياضياً مع أي مشتت
        const correctNormalized = normalizeLatex(correctOption.text);
        const distractors = question.options.filter(o => o.id !== question.correctId);
        
        for (const distractor of distractors) {
          const distractorNormalized = normalizeLatex(distractor.text);
          if (correctNormalized === distractorNormalized) {
            allFails.push({
              templateId: template.id,
              seed,
              error: `تطابق رياضي: الإجابة الصحيحة "${correctOption.text}" تساوي رياضياً المشتت "${distractor.text}"`,
              question,
            });
            fail++;
            break;
          }
        }

        if (fail === 0 || allFails[allFails.length - 1]?.seed !== seed) {
          pass++;
        }
      } catch (error) {
        allFails.push({
          templateId: template.id,
          seed,
          error: `استثناء: ${error instanceof Error ? error.message : String(error)}`,
        });
        fail++;
      }
    }

    summary[template.id] = { pass, fail };
  }

  // === التقرير النهائي ===
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 ملخص نتائج كل قالب:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let totalPass = 0;
  let totalFail = 0;

  for (const [id, stats] of Object.entries(summary)) {
    const total = stats.pass + stats.fail;
    const pct = ((stats.pass / total) * 100).toFixed(1);
    const icon = stats.fail === 0 ? '✅' : '⚠️';
    console.log(`${icon} ${id}: ${stats.pass}/${total} (${pct}%)`);
    totalPass += stats.pass;
    totalFail += stats.fail;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📈 الإجمالي: ${totalPass + totalFail} | ✅ ${totalPass} | ❌ ${totalFail} | 🎯 ${((totalPass / (totalPass + totalFail)) * 100).toFixed(1)}%`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (allFails.length > 0) {
    console.log('\n🔍 تفاصيل الأخطاء (أول 10 فقط):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for (const f of allFails.slice(0, 10)) {
      console.log(`• [${f.templateId}] seed=${f.seed}`);
      console.log(`  الخطأ: ${f.error}`);
      if (f.question) {
        console.log(`  الإجابة الصحيحة: ${f.question.options.find((o: any) => o.id === f.question.correctId)?.text}`);
        console.log(`  الخيارات: ${f.question.options.map((o: any) => `${o.id}) ${o.text}`).join(', ')}`);
      }
      console.log('');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } else {
    console.log('\n لا توجد أخطاء! كل القوالب سليمة رياضياً.\n');
  }

  if (totalFail > 0) process.exit(1);
}

runTests();