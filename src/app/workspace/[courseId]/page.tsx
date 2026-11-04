'use client';

import { useParams } from 'next/navigation';
import CourseHub from '@/components/CourseHub';

export default function CourseWorkspacePage() {
    const params = useParams();
    return <CourseHub courseId={params.courseId as string} />;
}
