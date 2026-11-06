// اسم الموقع داخل النصوص بنفس خط الشعار: Espr بالبني و Math بالأسود.
// الخط يُحدد على كل كلمة لأن globals.css يفرض Tajawal على كل العناصر.

const font: React.CSSProperties = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontStyle: 'italic',
    fontWeight: 700,
};

/** onDark للخلفيات الغامقة، وblack يكتب الاسم كله بالأسود داخل العناوين */
export default function BrandName({ onDark = false, black = false }: { onDark?: boolean; black?: boolean }) {
    return (
        <span dir="ltr" style={{ unicodeBidi: 'isolate', whiteSpace: 'nowrap' }}>
            <span style={{ ...font, color: onDark ? '#DCA27B' : black ? '#2C3531' : '#8B5E3C' }}>Espr</span>
            <span style={{ ...font, color: onDark ? '#FFF9E2' : '#2C3531' }}>Math</span>
        </span>
    );
}
