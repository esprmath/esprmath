// src/components/questions/Tex.tsx   (ملف جديد)
'use client';

import { memo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Tex = memo(function Tex({ math, block }: { math: string; block?: boolean }) {
  return block ? (
    <div dir="ltr">
      <BlockMath math={math} />
    </div>
  ) : (
    <span dir="ltr" style={{ display: 'inline-block', unicodeBidi: 'isolate' }}>
      <InlineMath math={math} />
    </span>
  );
});

export default Tex;