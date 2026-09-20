export interface CourseItem {
    code: string
    title: string
    creditHours: number    // الساعات المعتمدة (CH)
    maxAbsence: number     // حد الحرمان الأقصى (مجموع ساعات الدوام × 3)
    lectureHours: number   // ساعات الدوام النظرية (TH)
    labHours: number       // ساعات الدوام العملية/المعمل (LH)
}

export interface SemesterData {
    id: number
    name: string
    courses: CourseItem[]
}

export interface MajorData {
    id: string
    name: string
    semesters: SemesterData[]
}

export const availableMajors: MajorData[] = [
    {
        id: 'CS',
        name: 'تخصص علوم الحاسب (Computer Science)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (1st Year / 1st Semester)',
                courses: [
                    { code: 'ENGL 101', title: 'English Composition', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MATH 101', title: 'Calculus I', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'PHYS 101', title: 'General Physics I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 101', title: 'Computer Programming', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ISLM 101', title: 'Islamic Ideology', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (1st Year / 2nd Semester)',
                courses: [
                    { code: 'ENGL 131', title: 'Academic Writing Skills', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MATH 102', title: 'Calculus II', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'PHYS 102', title: 'General Physics II', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 102', title: 'Object Oriented Programming', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (2nd Year / 1st Semester)',
                courses: [
                    { code: 'CS 202', title: 'Discrete Mathematics', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'CS 201', title: 'Digital Logic', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 204', title: 'Data Structures', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MATH 204', title: 'Linear Algebra & Differential Equations', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'CS 203', title: 'Computer Organization & Assembly Language', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 311', title: 'Database Systems', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CS 277', title: 'Principles of Software Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MATH 206', title: 'Numerical Analysis', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 331', title: 'Professional Communication', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CSE 361', title: 'Introduction to Computer Networks', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CS 378', title: 'Introduction to Web Development', creditHours: 3, maxAbsence: 15, lectureHours: 3, labHours: 2 },
                    { code: 'CS 360', title: 'Programming Languages', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CS 379', title: 'Software and Interface Design', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'STAT 410', title: 'Probability & Statistics', creditHours: 4, maxAbsence: 12, lectureHours: 0, labHours: 4 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'CS 331', title: 'Artificial Intelligence', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CS 302', title: 'Design & Analysis of Algorithms', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'NET 363', title: 'Information & Computer Security', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 332', title: 'Technical Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'CSE',
        name: 'تخصص هندسة الحاسب (Computer Engineering)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (1st Year / 1st Semester)',
                courses: [
                    { code: 'ENGL 101', title: 'English Composition', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MATH 101', title: 'Calculus I', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'PHYS 101', title: 'General Physics I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 101', title: 'Computer Programming', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ISLM 101', title: 'Islamic Ideology', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (1st Year / 2nd Semester)',
                courses: [
                    { code: 'ENGL 131', title: 'Academic Writing Skills', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MATH 102', title: 'Calculus II', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'PHYS 102', title: 'General Physics II', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 102', title: 'Object Oriented Programming', creditHours: 3, maxAbsence: 21, lectureHours: 3, labHours: 4 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (2nd Year / 1st Semester)',
                courses: [
                    { code: 'MATH 201', title: 'Calculus III', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'CS 201', title: 'Digital Logic', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CSE 251', title: 'Electrical Circuit Analysis', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CS 202', title: 'Discrete Mathematics', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'CS 204', title: 'Data Structures', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MATH 204', title: 'Linear Algebra & Differential Equations', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'CS 203', title: 'Computer Organization & Assembly Language', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CSE 357', title: 'Electronics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ENGL 331', title: 'Professional Communication', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CS 311', title: 'Database Systems', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CS 480', title: 'Operating System', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'CSE 351', title: 'Signals and Systems', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CSE 363', title: 'Introduction to Computer Networks', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 301', title: 'Work Ethics in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'ENGL 332', title: 'Technical Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CSE 354', title: 'Principles of VLSI Design', creditHours: 2, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'CE',
        name: 'تخصص الهندسة الكيميائية (Chemical Engineering)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (1st Year / 1st Sem)',
                courses: [
                    { code: 'CHEM 101', title: 'General Chemistry I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'PHY 101', title: 'General Physics I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MA 101', title: 'Calculus I', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ESP 101', title: 'Introduction to Academic Discourse', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 101', title: 'Practical Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'HPE 101', title: 'Health and Physical Education', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (1st Year / 2nd Sem)',
                courses: [
                    { code: 'PHY 102', title: 'General Physics II', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MA 102', title: 'Calculus II', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ESP 102', title: 'Introduction to Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 102', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ISL 101', title: 'Belief and Its Consequences', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CSE 101', title: 'Introduction to Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (2nd Year / 1st Sem)',
                courses: [
                    { code: 'MA 201', title: 'Calculus III', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MA 202', title: 'Probability and Statistics for Engineers', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ESP 201', title: 'Academic and Professional Communication', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISL 201', title: 'Professional Ethics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CHEM 211', title: 'General Chemistry II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CHEM 212', title: 'General Chemistry II Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'CE 201', title: 'Principles of Chemical Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'MA 203', title: 'Elements of Differential Equations', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CSE 201', title: 'Introduction to Data Science', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 202', title: 'Materials Science', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 203', title: 'Introduction to Chemical Engineering Computing', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'CE 204', title: 'Introduction to Chemical Engineering Computing Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'CE 205', title: 'Fluid Mechanics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 206', title: 'Organic Chemistry', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 207', title: 'Organic Chemistry Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (3rd Year / 1st Sem)',
                courses: [
                    { code: 'MA 301', title: 'Numerical Methods for Engineers', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CSE 301', title: 'Introduction to Artificial Intelligence', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 201', title: 'Literary Styles', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CE 301', title: 'Chemical Engineering Thermodynamics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 302', title: 'Heat Transfer', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 303', title: 'Mass Transfer', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'MS 301', title: 'Business and Entrepreneurship', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ISL 301', title: 'Human Right in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CE 304', title: 'Separation Processes', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 305', title: 'Kinetics and Reactor Design', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 306', title: 'Chemical Engineering Lab I', creditHours: 2, maxAbsence: 18, lectureHours: 0, labHours: 6 },
                    { code: 'CE 307', title: 'Physical Chemistry', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CE 308', title: 'Physical Chemistry Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'CE 300', title: 'Design Project I', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'ME',
        name: 'تخصص الهندسة الميكانيكية (Mechanical Engineering)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (1st Year / 1st Sem)',
                courses: [
                    { code: 'CHEM 101', title: 'General Chemistry I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'PHY 101', title: 'General Physics I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MA 101', title: 'Calculus I', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ESP 101', title: 'Introduction to Academic Discourse', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 101', title: 'Practical Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'HPE 101', title: 'Health and Physical Education', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (1st Year / 2nd Sem)',
                courses: [
                    { code: 'PHY 102', title: 'General Physics II', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MA 102', title: 'Calculus II', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ESP 102', title: 'Introduction to Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 102', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ISL 101', title: 'Belief and Its Consequences', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CSE 101', title: 'Introduction to Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (2nd Year / 1st Sem)',
                courses: [
                    { code: 'MA 201', title: 'Calculus III', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MA 202', title: 'Probability and Statistics for Engineers', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ESP 201', title: 'Academic and Professional Communication', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 201', title: 'Mechanical Engineering Drawing and Graphics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ME 202', title: 'Mechanical Engineering Drawing and Graphics Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ME 203', title: 'Statics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 204', title: 'Thermodynamics I', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'MA 203', title: 'Elements of Differential Equations', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CSE 201', title: 'Introduction to Data Science', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISL 201', title: 'Professional Ethics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ME 205', title: 'Materials Science and Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 206', title: 'Materials Science and Engineering Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ME 207', title: 'Dynamics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 208', title: 'Thermodynamics II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (3rd Year / 1st Sem)',
                courses: [
                    { code: 'CSE 301', title: 'Introduction to Artificial Intelligence', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 201', title: 'Literary Styles', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'EE 331', title: 'Electrical Engineering Principles and Applications', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 332', title: 'Electrical Engineering Principles and Applications Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ME 301', title: 'Mechanics of Materials', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 302', title: 'Fluid Mechanics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 303', title: 'Manufacturing Processes', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 304', title: 'Manufacturing Processes Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'MA 301', title: 'Numerical Methods for Engineers', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MS 301', title: 'Business and Entrepreneurship', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ISL 301', title: 'Human Right in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ME 305', title: 'Machine Design', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 306', title: 'Mechanical System Design Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ME 307', title: 'Heat Transfer', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ME 308', title: 'Thermo-Fluid Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ME 300', title: 'Design Project I', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'EE',
        name: 'تخصص الهندسة الكهربائية (Electrical Engineering)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (1st Year / 1st Sem)',
                courses: [
                    { code: 'CHEM 101', title: 'General Chemistry I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'PHY 101', title: 'General Physics I', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MA 101', title: 'Calculus I', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ESP 101', title: 'Introduction to Academic Discourse', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 101', title: 'Practical Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 101', title: 'Health and Physical Education', creditHours: 1, maxAbsence: 0, lectureHours: 0, labHours: 0 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (1st Year / 2nd Sem)',
                courses: [
                    { code: 'PHY 102', title: 'General Physics II', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MA 102', title: 'Calculus II', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'ESP 102', title: 'Introduction to Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 102', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ISL 101', title: 'Belief and Its Consequences', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CSE 101', title: 'Introduction to Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (2nd Year / 1st Sem)',
                courses: [
                    { code: 'MA 201', title: 'Calculus III', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MA 202', title: 'Probability and Statistics for Engineers', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ESP 201', title: 'Academic and Professional Communication', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISL 201', title: 'Professional Ethics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CSE 221', title: 'Digital Logic Design', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 201', title: 'Electrical Circuits I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'MA 203', title: 'Elements of Differential Equations', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CSE 201', title: 'Introduction to Data Science', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARB 201', title: 'Literary Styles', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'EE 202', title: 'Electronics I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 203', title: 'Electronics I Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'EE 204', title: 'Signals and Systems', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 205', title: 'Electric Circuits II', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'EE 206', title: 'Electric Circuits II Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (3rd Year / 1st Sem)',
                courses: [
                    { code: 'CSE 301', title: 'Introduction to Artificial Intelligence', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISL 301', title: 'Human Right in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PHY 321', title: 'Electricity and Magnetism', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 301', title: 'Electronics II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 302', title: 'Electrical Energy Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 303', title: 'Electrical Energy Engineering Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'EE 304', title: 'Control Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 305', title: 'Control Engineering Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'MA 301', title: 'Numerical Methods for Engineers', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MS 301', title: 'Business and Entrepreneurship', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'EE 306', title: 'Fundamentals of Electrical Engineering Design', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 307', title: 'Communications Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 308', title: 'Communications Engineering Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'EE 309', title: 'Digital Systems Engineering', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'EE 310', title: 'Digital Systems Engineering Lab', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'EE 300', title: 'Design Project I', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'MKT',
        name: 'تخصص التسويق (Marketing)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Semester)',
                courses: [
                    { code: 'ECON 101', title: 'Microeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 101', title: 'English Composition I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 101', title: 'Islamic Ideology and Thought', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MATH 111', title: 'Calculus for Management', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'MGT 211', title: 'Principles of Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'ACCT 110', title: 'Financial Accounting I', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENGL 102', title: 'English Composition II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MIS 203', title: 'Principles of MIS', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MKT 211', title: 'Principles of Marketing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ACCT 212', title: 'Managerial Accounting', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ECON 102', title: 'Macroeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 211', title: 'Business Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SOSC 101', title: 'Behavioral Science in Business', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'STAT 211', title: 'Statistics for Management I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGL 212', title: 'Business Communication', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MGT 212', title: 'Quantitative Analysis for Mgt.', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 213', title: 'Human Resource Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 214', title: 'Operations Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'STAT 311', title: 'Statistics for Management II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (4th Year / 1st Semester)',
                courses: [
                    { code: 'FIN 220', title: 'Principles of Finance', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 315', title: 'Business Law', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 316', title: 'Entrepreneurship', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MKT 321', title: 'Consumer Behaviour', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MKT 322', title: 'Marketing Research', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 301', title: 'Work Ethics in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (4th Year / 2nd Semester)',
                courses: [
                    { code: 'MGT 317', title: 'International Global Business', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MKT 323', title: 'New Product Development & Pricing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MKT 324', title: 'Integrated Marketing Communication', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MKT 325', title: 'Supply Chain Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'Major Elective I', title: 'Major Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'General Elective', title: 'General Elective', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'ACCT',
        name: 'تخصص المحاسبة (Accounting)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Semester)',
                courses: [
                    { code: 'ECON 101', title: 'Microeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 101', title: 'English Composition I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 101', title: 'Islamic Ideology and Thought', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MATH 111', title: 'Calculus for Management', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'MGT 211', title: 'Principles of Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'ACCT 110', title: 'Financial Accounting I', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENGL 102', title: 'English Composition II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MIS 203', title: 'Principles Of MIS', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ECON 102', title: 'Macroeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ACCT 211', title: 'Financial Accounting II', creditHours: 2, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ACCT 242', title: 'Managerial Accounting', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MKT 211', title: 'Principles of Marketing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 211', title: 'Business Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'STAT 211', title: 'Statistics for Management I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'ACCT 214', title: 'Intermediate Accounting', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'FIN 220', title: 'Principles Of Finance', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 212', title: 'Research Methodology', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 214', title: 'Operations Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 212', title: 'Business Communication', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'STAT 311', title: 'Statistics for Management II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (4th Year / 1st Semester)',
                courses: [
                    { code: 'ACCT 315', title: 'Cost Accounting', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'FIN 312', title: 'Corporate Finance', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ACCT 316', title: 'Oil and Gas Accounting', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ACCT 322', title: 'Accounting Information Systems', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MGT 315', title: 'Business Law', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 301', title: 'Work Ethics in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (4th Year / 2nd Semester)',
                courses: [
                    { code: 'ACCT 317', title: 'Forensic Accounting', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ACCT 319', title: 'International Accounting', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ACCT 323', title: 'Accounting for Government and Non-profit Organizations', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'Major Elective I', title: 'Major Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'General Elective I', title: 'General Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'HRM',
        name: 'تخصص الموارد البشرية (Human Resources Management)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Semester)',
                courses: [
                    { code: 'ENGL 101', title: 'English Composition I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MATH 111', title: 'Calculus for Management', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'MGT 211', title: 'Principles of Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ECON 101', title: 'Microeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 101', title: 'Islamic Ideology and Thought', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'ENGL 102', title: 'English Composition II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MIS 203', title: 'Principles Of MIS', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ACCT 110', title: 'Financial Accounting I', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'MKT 211', title: 'Principles of Marketing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ENGL 211', title: 'Business Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'STAT 211', title: 'Statistics for Management I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ACCT 212', title: 'Managerial Accounting', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'SOSC 101', title: 'Behavioral Science in Business', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ECON 102', title: 'Macroeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'ENGL 212', title: 'Business Communication', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MGT 212', title: 'Research Methodology', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'STAT 311', title: 'Statistics for Management II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 214', title: 'Operations Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 213', title: 'Human Resource Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (4th Year / 1st Semester)',
                courses: [
                    { code: 'MGT 315', title: 'Business Law', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 316', title: 'Entrepreneurship', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'FIN 220', title: 'Principles of Finance', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'HRM 321', title: 'Human Resource Planning and Acquisition', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'HRM 322', title: 'Compensation and Performance Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 301', title: 'Work Ethics in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (4th Year / 2nd Semester)',
                courses: [
                    { code: 'MGT 317', title: 'International/Global Business', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'HRM 320', title: 'Training and Development', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'HRM 324', title: 'Organization Development and Change Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'HRM 325', title: 'Issues and Development in HRM', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'Major Elective I', title: 'Major Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'General Elective I', title: 'General Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'MIS',
        name: 'نظم المعلومات الإدارية (Management Information Systems)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Semester)',
                courses: [
                    { code: 'ECON 101', title: 'Microeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 101', title: 'English Composition I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 101', title: 'Islamic Ideology and Thought', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MATH 111', title: 'Calculus for Management', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'MGT 211', title: 'Principles of Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'ACCT 110', title: 'Financial Accounting I', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENGL 102', title: 'English Composition II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MIS 203', title: 'Principles Of MIS', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MKT 211', title: 'Principles of Marketing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ACCT 212', title: 'Managerial Accounting', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ECON 102', title: 'Macroeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 211', title: 'Business Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MATH 112', title: 'Calculus for Management II', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'MIS 101', title: 'Introduction to Computer Programming', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGL 212', title: 'Business Communication', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MGT 212', title: 'Research Methodology', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MIS 102', title: 'Introduction to Informatics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MIS 202', title: 'Data Management', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'STAT 211', title: 'Statistics for Management I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (4th Year / 1st Semester)',
                courses: [
                    { code: 'FIN 220', title: 'Principles of Finance', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 315', title: 'Business Law', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MIS 201', title: 'Data & Information Structures', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MIS 340', title: 'Business Data Communication & Networking', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MIS 341', title: 'System Analysis & Design I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'STAT 311', title: 'Statistics for Management II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (4th Year / 2nd Semester)',
                courses: [
                    { code: 'ISLM 301', title: 'Work Ethics in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MGT 214', title: 'Operations Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'General Elective I', title: 'General Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MIS 342', title: 'System Analysis & Design II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MIS 343', title: 'Principles of E-Commerce', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MIS Specialization Elective I', title: 'MIS Specialization Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'SCM',
        name: 'إدارة سلاسل الإمداد (Supply Chain Management)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Semester)',
                courses: [
                    { code: 'ECON 101', title: 'Microeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 101', title: 'English Composition I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 101', title: 'Islamic Ideology and Thought', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MATH 111', title: 'Calculus for Management', creditHours: 4, maxAbsence: 12, lectureHours: 4, labHours: 0 },
                    { code: 'MGT 211', title: 'Principles of Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Semester)',
                courses: [
                    { code: 'ACCT 110', title: 'Financial Accounting I', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENGL 102', title: 'English Composition II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 201', title: 'Human Rights in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MIS 203', title: 'Principles Of MIS', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MKT 211', title: 'Principles of Marketing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'PE 102', title: 'Physical Education II', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ARAB 101', title: 'Functional Grammar', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Semester)',
                courses: [
                    { code: 'ACCT 212', title: 'Managerial Accounting', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ARAB 201', title: 'Objective Writing', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ECON 102', title: 'Macroeconomics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGL 211', title: 'Business Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SOSC 101', title: 'Behavioral Science in Business', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'STAT 211', title: 'Statistics for Management I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Semester)',
                courses: [
                    { code: 'ARAB 301', title: 'Arabic Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGL 212', title: 'Business Communication', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MGT 212', title: 'Research Methodology', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 213', title: 'Human Resource Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 214', title: 'Operations Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'STAT 311', title: 'Statistics for Management II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 5,
                name: 'الترم الخامس (4th Year / 1st Semester)',
                courses: [
                    { code: 'FIN 220', title: 'Principles of Finance', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ISLM 301', title: 'Work Ethics in Islam', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MGT 315', title: 'Business Law', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MGT 316', title: 'Entrepreneurship', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SCM 321', title: 'Fundamentals of Supply Chain Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SCM 322', title: 'Procurement Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 6,
                name: 'الترم السادس (4th Year / 2nd Semester)',
                courses: [
                    { code: 'MGT 317', title: 'International Business', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SCM 323', title: 'Inventory Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SCM 324', title: 'Warehouse Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'SCM 325', title: 'Logistics Management', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'General Elective I', title: 'General Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'Major Elective I', title: 'Major Elective I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            }
        ]
    },
    {
        id: 'EPT',
        name: 'دبلوم تقنية القوى الكهربائية (Electrical Power Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 3, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 101', title: 'Electrical Circuits I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 104', title: 'Computer Programming', creditHours: 3, maxAbsence: 9, lectureHours: 1, labHours: 2 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ELET 102', title: 'Electrical Circuits II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 103', title: 'Electrical Machines I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 105', title: 'Electronics I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 201', title: 'Basic Industrial Electronics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 202', title: 'Digital Electronics I', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ELET 203', title: 'Control System Components', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 221', title: 'Electrical Installations', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 222', title: 'Electrical Machines II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'ELET 223', title: 'Electrical Motor Control', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 224', title: 'Electrical Power Systems', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ELET 225', title: 'Electrical Trbl Shtg & Maint', creditHours: 4, maxAbsence: 24, lectureHours: 2, labHours: 6 },
                ]
            }
        ]
    },
    {
        id: 'ICT',
        name: 'دبلوم تقنية الأجهزة والتحكم (Instrumentation and Control Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 101', title: 'Electric Circuit I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 104', title: 'Computer Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ELET 102', title: 'Electrical Circuits II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 103', title: 'Electrical Machines I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 105', title: 'Electronics I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 201', title: 'Basic Industrial Electronics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 202', title: 'Digital Electronics I', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ELET 203', title: 'Control System Components', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 211', title: 'Instrumentation Electronics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 241', title: 'Process Instrumentation', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'ELET 212', title: 'Microcontroller', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ELET 242', title: 'Process Control Systems', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 243', title: 'Instrumentation Trouble Shooting & Maintenance', creditHours: 4, maxAbsence: 24, lectureHours: 2, labHours: 6 },
                    { code: 'CMET 221', title: 'Analytical Instrumentation', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'POCAT',
        name: 'دبلوم هندسة العمليات وتفصيل التحليل الكيميائي (Process Operations & Chemical Analysis Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENGT 101', title: 'Engineering Drafting', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'CMET 101', title: 'Intro. to Chem. Engg. Tech', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CMET 105', title: 'Fluid Mechanics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'CMET 102', title: 'Methods of Chem. Analysis', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CMET 103', title: 'Applied Organic Chemistry', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CMET 106', title: 'Process Heat Transfer', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'ELET 104', title: 'Computer Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'CMET 202', title: 'Chem. Engg. Thermodynamics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CMET 205', title: 'Mass Transfer Operations', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CMET 231', title: 'Petroleum Refining & Testing', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'CMET 203', title: 'Environmental Pollution', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CMET 204', title: 'Process Inst. & Control', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'CMET 232', title: 'Petrochemicals', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'MMT',
        name: 'دبلوم تقنية الصيانة الميكانيكية (Mechanical Maintenance Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGT 101', title: 'Engineering Drafting', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'MCET 101', title: 'Plant Maintenance', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 102', title: 'Mechanical Measurements', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MCET 103', title: 'Machining Processes I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 104', title: 'Materials Technology', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 105', title: 'Applied Statics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 204', title: 'Industrial Electricity', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 201', title: 'Mechanical Drafting', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'MCET 211', title: 'Applied Thermodynamics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 212', title: 'Fluid Machines', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'MCET 213', title: 'Equipment Maintenance', creditHours: 4, maxAbsence: 24, lectureHours: 2, labHours: 6 },
                    { code: 'MCET 214', title: 'Heat Exchangers', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'Technical Elective', title: 'Technical Elective', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'MT',
        name: 'دبلوم تقنية التصنيع (Manufacturing Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENGT 101', title: 'Engineering Drafting', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'MCET 101', title: 'Plant Maintenance', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 102', title: 'Mechanical Measurements', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'MCET 103', title: 'Machining Processes I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 104', title: 'Materials Technology', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 105', title: 'Applied Statics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 104', title: 'Computer Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ELET 204', title: 'Industrial Electricity', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 201', title: 'Mechanical Drafting', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'MCET 221', title: 'Machining Processes II', creditHours: 3, maxAbsence: 21, lectureHours: 1, labHours: 6 },
                    { code: 'MCET 222', title: 'Applied Strength of Materials', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'MCET 211', title: 'Applied Thermodynamics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 224', title: 'Inspection and Quality Control', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'MCET 226', title: 'Welding Technology', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'Technical Elective', title: 'Technical Elective', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'MecT',
        name: 'دبلوم تقنية الميكاترونكس (Mechatronics Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 101', title: 'Electrical Circuits I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 104', title: 'Computer Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ELET 102', title: 'Electrical Circuits II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 104', title: 'Materials Technology', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 105', title: 'Applied Statics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'ELET 202', title: 'Digital Electronics I', creditHours: 3, maxAbsence: 9, lectureHours: 1, labHours: 2 },
                    { code: 'ELET 203', title: 'Control System Components', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 103', title: 'Electrical Machines I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 212', title: 'Fluid Machines', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 222', title: 'Applied Strength of Materials', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'MCET 103', title: 'Machining Processes I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'MCET 301', title: 'Applied Dynamics', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ELET 251', title: 'Maintenance and Reliability Engineering in Mechatronics', creditHours: 2, maxAbsence: 18, lectureHours: 0, labHours: 6 },
                    { code: 'ELET 252', title: 'Introduction to Mechatronics System Design', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            }
        ]
    },
    {
        id: 'ECT',
        name: 'دبلوم تقنية الإكترونيات والاتصالات (Electronics and Communication Technology)',
        semesters: [
            {
                id: 1,
                name: 'الترم الأول (2nd Year / 1st Sem)',
                courses: [
                    { code: 'ENG 101', title: 'English Communication', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'GSMA 101', title: 'Calculus I', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSPH 101', title: 'General Physics', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSPE 101', title: 'Physical Education I', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ELET 101', title: 'Electric Circuit I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 104', title: 'Computer Programming', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                ]
            },
            {
                id: 2,
                name: 'الترم الثاني (2nd Year / 2nd Sem)',
                courses: [
                    { code: 'GSCH 101', title: 'General Chemistry', creditHours: 4, maxAbsence: 18, lectureHours: 3, labHours: 3 },
                    { code: 'GSMA 102', title: 'Calculus II', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'ENG 102', title: 'English Composition', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ELET 102', title: 'Electrical Circuits II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 103', title: 'Electrical Machines I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 105', title: 'Electronics I', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 3,
                name: 'الترم الثالث (3rd Year / 1st Sem)',
                courses: [
                    { code: 'GSST 201', title: 'Applied Statistics', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ENGT 201', title: 'Industrial Safety', creditHours: 1, maxAbsence: 6, lectureHours: 0, labHours: 2 },
                    { code: 'ENGT 202', title: 'Industrial Supervision', creditHours: 1, maxAbsence: 3, lectureHours: 1, labHours: 0 },
                    { code: 'ELET 201', title: 'Basic Industrial Electronics', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 202', title: 'Digital Electronics I', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ELET 203', title: 'Control System Components', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 230', title: 'PCB Fabrication', creditHours: 1, maxAbsence: 9, lectureHours: 0, labHours: 3 },
                    { code: 'ELET 231', title: 'Electronics II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            },
            {
                id: 4,
                name: 'الترم الرابع (3rd Year / 2nd Sem)',
                courses: [
                    { code: 'ENG 201', title: 'Technical Report Writing', creditHours: 3, maxAbsence: 9, lectureHours: 3, labHours: 0 },
                    { code: 'GSIS 101', title: 'Islamic Ideology and Thoughts', creditHours: 2, maxAbsence: 6, lectureHours: 2, labHours: 0 },
                    { code: 'ELET 212', title: 'Microcontroller', creditHours: 2, maxAbsence: 12, lectureHours: 1, labHours: 3 },
                    { code: 'ELET 232', title: 'Digital Electronics II', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 233', title: 'Analog & Digital Communications', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                    { code: 'ELET 234', title: 'Troubleshooting and Maintenance', creditHours: 2, maxAbsence: 18, lectureHours: 0, labHours: 6 },
                    { code: 'ELET 235', title: 'Telecommunication Systems', creditHours: 3, maxAbsence: 15, lectureHours: 2, labHours: 3 },
                ]
            }
        ]
    }
]