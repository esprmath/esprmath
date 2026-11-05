// src/lib/video.ts

/** يحوّل أي رابط يوتيوب إلى رابط يعمل داخل الصفحة. يرجع null إذا لم يكن رابط يوتيوب */
export function toEmbedUrl(url: string): string | null {
    const match = url.trim().match(
        /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})(?:[?&#].*)?$/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
