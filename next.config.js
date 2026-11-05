/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},

    // الروابط القديمة للكويز تحوّل للرابط الجديد
    async redirects() {
        return [
            {
                source: '/workspace/101/exam-leaks/:quizId',
                destination: '/workspace/101/quizzes/:quizId',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
