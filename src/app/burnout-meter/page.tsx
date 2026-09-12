'use client';

import { useState } from 'react';
import Link from 'next/link';

// قاعدة بيانات دقيقة ومحدثة (البكالوريوس 6 أترام - الدبلومات 4 أترام دراسية كاملة)
const departmentsData: { [key: string]: { name: string, category: string, color: string, terms: { termName: string, courses: { id: string, name: string, hours: number, stress: number }[] }[] } } = {
    cs: {
        name: 'علوم الحاسب (CS)',
        category: 'بكالوريوس',
        color: '#6B5744',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'cs_engl101', name: 'English Composition (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'cs_math101', name: 'Calculus I (MATH 101)', hours: 4, stress: 40 },
                    { id: 'cs_phys101', name: 'General Physics I (PHYS 101)', hours: 4, stress: 40 },
                    { id: 'cs_prog1', name: 'Computer Programming (CS 101)', hours: 3, stress: 35 },
                    { id: 'cs_islm101', name: 'Islamic Ideology (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'cs_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'cs_engl131', name: 'Academic Writing Skills (ENGL 131)', hours: 3, stress: 30 },
                    { id: 'cs_math102', name: 'Calculus II (MATH 102)', hours: 4, stress: 40 },
                    { id: 'cs_phys102', name: 'General Physics II (PHYS 102)', hours: 4, stress: 40 },
                    { id: 'cs_prog2', name: 'Object Oriented Programming (CS 102)', hours: 3, stress: 40 },
                    { id: 'cs_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 },
                    { id: 'cs_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'cs_discrete', name: 'Discrete Mathematics (CS 202)', hours: 4, stress: 45 },
                    { id: 'cs_logic', name: 'Digital Logic (CS 201)', hours: 4, stress: 40 },
                    { id: 'cs_ds', name: 'Data Structures (CS 204)', hours: 4, stress: 45 },
                    { id: 'cs_math204', name: 'Linear Algebra & Diff Equations (MATH 204)', hours: 4, stress: 50 },
                    { id: 'cs_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'cs_assembly', name: 'Computer Organization & Assembly Language (CS 203)', hours: 4, stress: 45 },
                    { id: 'cs_db', name: 'Database Systems (CS 311)', hours: 3, stress: 35 },
                    { id: 'cs_se', name: 'Principles of Software Engineering (CS 277)', hours: 3, stress: 35 },
                    { id: 'cs_islm201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 },
                    { id: 'cs_num', name: 'Numerical Analysis (MATH 206)', hours: 3, stress: 40 },
                    { id: 'cs_engl331', name: 'Professional Communication (ENGL 331)', hours: 3, stress: 30 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'cs_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 },
                    { id: 'cs_nets_intro', name: 'Introduction to Computer Networks (CSE 361)', hours: 3, stress: 40 },
                    { id: 'cs_web_intro', name: 'Introduction to Web Development (CS 378)', hours: 3, stress: 35 },
                    { id: 'cs_langs', name: 'Programming Languages (CS 360)', hours: 3, stress: 40 },
                    { id: 'cs_ui', name: 'Software and Interface Design (CS 379)', hours: 3, stress: 35 },
                    { id: 'cs_stat', name: 'Probability & Statistics (STAT 410)', hours: 4, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'cs_ai', name: 'Artificial Intelligence (CS 331)', hours: 3, stress: 45 },
                    { id: 'cs_track1', name: 'Track Elective I', hours: 3, stress: 35 },
                    { id: 'cs_track2', name: 'Track Elective II', hours: 3, stress: 35 },
                    { id: 'cs_algo', name: 'Design & Analysis of Algorithms (CS 302)', hours: 3, stress: 50 },
                    { id: 'cs_sec', name: 'Information & Computer Security (NET 363)', hours: 3, stress: 40 },
                    { id: 'cs_engl332', name: 'Technical Writing (ENGL 332)', hours: 3, stress: 30 }
                ]
            }
        ]
    },
    cse: {
        name: 'هندسة الحاسب (CSE)',
        category: 'بكالوريوس',
        color: '#2C3531',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'cse_engl101', name: 'English Composition (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'cse_math101', name: 'Calculus I (MATH 101)', hours: 4, stress: 40 },
                    { id: 'cse_phys101', name: 'General Physics I (PHYS 101)', hours: 4, stress: 40 },
                    { id: 'cse_cs101', name: 'Computer Programming (CS 101)', hours: 3, stress: 35 },
                    { id: 'cse_islm101', name: 'Islamic Ideology (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'cse_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'cse_engl131', name: 'Academic Writing Skills (ENGL 131)', hours: 3, stress: 30 },
                    { id: 'cse_math102', name: 'Calculus II (MATH 102)', hours: 4, stress: 40 },
                    { id: 'cse_phys102', name: 'General Physics II (PHYS 102)', hours: 4, stress: 40 },
                    { id: 'cse_cs102', name: 'Object Oriented Programming (CS 102)', hours: 3, stress: 40 },
                    { id: 'cse_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 },
                    { id: 'cse_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'cse_math201', name: 'Calculus III (MATH 201)', hours: 4, stress: 35 },
                    { id: 'cse_logic', name: 'Digital Logic (CS 201)', hours: 4, stress: 40 },
                    { id: 'cse_circ', name: 'Electrical Circuit Analysis (CSE 251)', hours: 4, stress: 40 },
                    { id: 'cse_discrete', name: 'Discrete Mathematics (CS 202)', hours: 4, stress: 45 },
                    { id: 'cse_isem201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'cse_ds', name: 'Data Structures (CS 204)', hours: 4, stress: 45 },
                    { id: 'cse_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 },
                    { id: 'cse_math204', name: 'Linear Algebra & Diff Equations (MATH 204)', hours: 4, stress: 50 },
                    { id: 'cse_assembly', name: 'Computer Org & Assembly (CS 203)', hours: 4, stress: 45 },
                    { id: 'cse_electronics', name: 'Electronics (CSE 357)', hours: 4, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'cse_engl331', name: 'Professional Communication (ENGL 331)', hours: 3, stress: 30 },
                    { id: 'cse_db', name: 'Database Systems (CS 311)', hours: 3, stress: 35 },
                    { id: 'cse_os', name: 'Operating System (CS 480)', hours: 4, stress: 50 },
                    { id: 'cse_signals', name: 'Signals and Systems (CSE 351)', hours: 3, stress: 40 },
                    { id: 'cse_nets_intro', name: 'Intro to Computer Networks (CSE 363)', hours: 3, stress: 40 },
                    { id: 'cse_work_ethics', name: 'Work Ethics in Islam (ISLM 301)', hours: 2, stress: 15 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'cse_engl332', name: 'Technical Writing (ENGL 332)', hours: 3, stress: 30 },
                    { id: 'cse_track1', name: 'Embedded Systems / Track Core I', hours: 4, stress: 45 },
                    { id: 'cse_track2', name: 'Track Core II', hours: 4, stress: 45 },
                    { id: 'cse_vlsi', name: 'Principles of VLSI Design (CSE 354)', hours: 2, stress: 40 },
                    { id: 'cse_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 }
                ]
            }
        ]
    },
    ce: {
        name: 'هندسة الكيمياء (CE)',
        category: 'بكالوريوس',
        color: '#C4863A',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'ce_chem101', name: 'General Chemistry I (CHEM 101)', hours: 4, stress: 35 },
                    { id: 'ce_phy101', name: 'General Physics I (PHY 101)', hours: 4, stress: 40 },
                    { id: 'ce_ma101', name: 'Calculus I (MA 101)', hours: 4, stress: 40 },
                    { id: 'ce_esp101', name: 'Intro to Academic Discourse (ESP 101)', hours: 3, stress: 25 },
                    { id: 'ce_arb101', name: 'Practical Grammar (ARB 101)', hours: 2, stress: 20 },
                    { id: 'ce_hpe101', name: 'Health and Physical Education (HPE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'ce_phy102', name: 'General Physics II (PHY 102)', hours: 4, stress: 40 },
                    { id: 'ce_ma102', name: 'Calculus II (MA 102)', hours: 4, stress: 40 },
                    { id: 'ce_esp102', name: 'Report Writing (ESP 102)', hours: 3, stress: 25 },
                    { id: 'ce_arb102', name: 'Objective Writing (ARB 102)', hours: 2, stress: 20 },
                    { id: 'ce_isl101', name: 'Belief & Consequences (ISL 101)', hours: 2, stress: 15 },
                    { id: 'ce_cse101', name: 'Intro to Programming (CSE 101)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'ce_ma201', name: 'Calculus III (MA 201)', hours: 3, stress: 35 },
                    { id: 'ce_ma202', name: 'Probability & Statistics (MA 202)', hours: 3, stress: 35 },
                    { id: 'ce_esp201', name: 'Academic & Professional Comm (ESP 201)', hours: 3, stress: 30 },
                    { id: 'ce_isl201', name: 'Professional Ethics (ISL 201)', hours: 2, stress: 20 },
                    { id: 'ce_chem211', name: 'General Chemistry II (CHEM 211)', hours: 3, stress: 35 },
                    { id: 'ce_chem212', name: 'General Chemistry II Lab (CHEM 212)', hours: 1, stress: 25 },
                    { id: 'ce_prin', name: 'Principles of Chemical Engineering (CE 201)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'ce_ma203', name: 'Differential Equations (MA 203)', hours: 3, stress: 45 },
                    { id: 'ce_cse201', name: 'Data Science (CSE 201)', hours: 3, stress: 35 },
                    { id: 'ce_mat', name: 'Materials Science (CE 202)', hours: 3, stress: 35 },
                    { id: 'ce_comp', name: 'Chem Eng Computing (CE 203)', hours: 1, stress: 30 },
                    { id: 'ce_comp_lab', name: 'Chem Eng Computing Lab (CE 204)', hours: 1, stress: 25 },
                    { id: 'ce_fluid', name: 'Fluid Mechanics (CE 205)', hours: 3, stress: 50 },
                    { id: 'ce_org', name: 'Organic Chemistry (CE 206)', hours: 3, stress: 40 },
                    { id: 'ce_org_lab', name: 'Organic Chemistry Lab (CE 207)', hours: 1, stress: 25 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'ce_num', name: 'Numerical Methods (MA 301)', hours: 3, stress: 40 },
                    { id: 'ce_ai', name: 'Intro to Artificial Intelligence (CSE 301)', hours: 3, stress: 40 },
                    { id: 'ce_arb201', name: 'Literary Styles (ARB 201)', hours: 2, stress: 20 },
                    { id: 'ce_thermo', name: 'Chemical Engineering Thermodynamics (CE 301)', hours: 3, stress: 50 },
                    { id: 'ce_heat', name: 'Heat Transfer (CE 302)', hours: 3, stress: 50 },
                    { id: 'ce_mass', name: 'Mass Transfer (CE 303)', hours: 3, stress: 50 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'ce_bus', name: 'Business & Entrepreneurship (MS 301)', hours: 2, stress: 25 },
                    { id: 'ce_isl301', name: 'Human Right in Islam (ISL 301)', hours: 2, stress: 15 },
                    { id: 'ce_sep', name: 'Separation Processes (CE 304)', hours: 3, stress: 50 },
                    { id: 'ce_kinetics', name: 'Kinetics and Reactor Design (CE 305)', hours: 3, stress: 55 },
                    { id: 'ce_lab1', name: 'Chemical Engineering Lab I (CE 306)', hours: 2, stress: 40 },
                    { id: 'ce_phys_chem', name: 'Physical Chemistry (CE 307)', hours: 3, stress: 40 },
                    { id: 'ce_phys_chem_lab', name: 'Physical Chemistry Lab (CE 308)', hours: 1, stress: 25 },
                    { id: 'ce_design1', name: 'Design Project I (CE 300)', hours: 2, stress: 40 }
                ]
            }
        ]
    },
    me: {
        name: 'الهندسة الميكانيكية (ME)',
        category: 'بكالوريوس',
        color: '#7C9E6B',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'me_chem101', name: 'General Chemistry I (CHEM 101)', hours: 4, stress: 35 },
                    { id: 'me_phy101', name: 'General Physics I (PHY 101)', hours: 4, stress: 40 },
                    { id: 'me_ma101', name: 'Calculus I (MA 101)', hours: 4, stress: 40 },
                    { id: 'me_esp101', name: 'Intro to Academic Discourse (ESP 101)', hours: 3, stress: 25 },
                    { id: 'me_arb101', name: 'Practical Grammar (ARB 101)', hours: 2, stress: 20 },
                    { id: 'me_hpe101', name: 'Health and Physical Education (HPE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'me_phy102', name: 'General Physics II (PHY 102)', hours: 4, stress: 40 },
                    { id: 'me_ma102', name: 'Calculus II (MA 102)', hours: 4, stress: 40 },
                    { id: 'me_esp102', name: 'Report Writing (ESP 102)', hours: 3, stress: 25 },
                    { id: 'me_arb102', name: 'Objective Writing (ARB 102)', hours: 2, stress: 20 },
                    { id: 'me_isl101', name: 'Belief & Consequences (ISL 101)', hours: 2, stress: 15 },
                    { id: 'me_cse101', name: 'Intro to Programming (CSE 101)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'me_ma201', name: 'Calculus III (MA 201)', hours: 3, stress: 35 },
                    { id: 'me_ma202', name: 'Probability & Statistics (MA 202)', hours: 3, stress: 35 },
                    { id: 'me_esp201', name: 'Academic & Professional Comm (ESP 201)', hours: 3, stress: 30 },
                    { id: 'me_draw', name: 'ME Drawing and Graphics (ME 201)', hours: 2, stress: 35 },
                    { id: 'me_draw_lab', name: 'ME Drawing and Graphics Lab (ME 202)', hours: 1, stress: 25 },
                    { id: 'me_statics', name: 'Statics (ME 203)', hours: 3, stress: 40 },
                    { id: 'me_thermo1', name: 'Thermodynamics I (ME 204)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'me_ma203', name: 'Differential Equations (MA 203)', hours: 3, stress: 45 },
                    { id: 'me_cse201', name: 'Data Science (CSE 201)', hours: 3, stress: 35 },
                    { id: 'me_isl201', name: 'Professional Ethics (ISL 201)', hours: 2, stress: 20 },
                    { id: 'me_mat', name: 'Materials Science and Engineering (ME 205)', hours: 3, stress: 35 },
                    { id: 'me_mat_lab', name: 'Materials Science and Engineering Lab (ME 206)', hours: 1, stress: 25 },
                    { id: 'me_dyn', name: 'Dynamics (ME 207)', hours: 3, stress: 45 },
                    { id: 'me_thermo2', name: 'Thermodynamics II (ME 208)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'me_ai', name: 'Intro to Artificial Intelligence (CSE 301)', hours: 3, stress: 40 },
                    { id: 'me_arb201', name: 'Literary Styles (ARB 201)', hours: 2, stress: 20 },
                    { id: 'me_ee_prin', name: 'EE Principles and Applications (EE 331)', hours: 3, stress: 35 },
                    { id: 'me_ee_prin_lab', name: 'EE Principles and Applications Lab (EE 332)', hours: 1, stress: 25 },
                    { id: 'me_mech_mat', name: 'Mechanics of Materials (ME 301)', hours: 3, stress: 45 },
                    { id: 'me_fluid', name: 'Fluid Mechanics (ME 302)', hours: 3, stress: 50 },
                    { id: 'me_mfg', name: 'Manufacturing Processes (ME 303)', hours: 3, stress: 35 },
                    { id: 'me_mfg_lab', name: 'Manufacturing Processes Lab (ME 304)', hours: 1, stress: 25 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'me_num', name: 'Numerical Methods (MA 301)', hours: 3, stress: 40 },
                    { id: 'me_bus', name: 'Business & Entrepreneurship (MS 301)', hours: 2, stress: 25 },
                    { id: 'me_isl301', name: 'Human Right in Islam (ISL 301)', hours: 2, stress: 15 },
                    { id: 'me_design_mch', name: 'Machine Design (ME 305)', hours: 3, stress: 45 },
                    { id: 'me_design_mch_lab', name: 'Mechanical System Design Lab (ME 306)', hours: 1, stress: 25 },
                    { id: 'me_heat', name: 'Heat Transfer (ME 307)', hours: 3, stress: 45 },
                    { id: 'me_heat_lab', name: 'Thermo-Fluid Lab (ME 308)', hours: 1, stress: 25 },
                    { id: 'me_design1', name: 'Design Project I (ME 300)', hours: 2, stress: 40 }
                ]
            }
        ]
    },
    ee: {
        name: 'هندسة الكهرباء (EE)',
        category: 'بكالوريوس',
        color: '#8B5E3C',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'ee_chem101', name: 'General Chemistry I (CHEM 101)', hours: 4, stress: 35 },
                    { id: 'ee_phy101', name: 'General Physics I (PHY 101)', hours: 4, stress: 40 },
                    { id: 'ee_ma101', name: 'Calculus I (MA 101)', hours: 4, stress: 40 },
                    { id: 'ee_esp101', name: 'Intro to Academic Discourse (ESP 101)', hours: 3, stress: 25 },
                    { id: 'ee_arb101', name: 'Practical Grammar (ARB 101)', hours: 2, stress: 20 },
                    { id: 'ee_pe101', name: 'Health and Physical Education (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'ee_phy102', name: 'General Physics II (PHY 102)', hours: 4, stress: 40 },
                    { id: 'ee_ma102', name: 'Calculus II (MA 102)', hours: 4, stress: 40 },
                    { id: 'ee_esp102', name: 'Report Writing (ESP 102)', hours: 3, stress: 25 },
                    { id: 'ee_arb102', name: 'Objective Writing (ARB 102)', hours: 2, stress: 20 },
                    { id: 'ee_isl101', name: 'Belief & Consequences (ISL 101)', hours: 2, stress: 15 },
                    { id: 'ee_cse101', name: 'Intro to Programming (CSE 101)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'ee_ma201', name: 'Calculus III (MA 201)', hours: 3, stress: 35 },
                    { id: 'ee_ma202', name: 'Probability & Statistics (MA 202)', hours: 3, stress: 35 },
                    { id: 'ee_esp201', name: 'Academic & Professional Comm (ESP 201)', hours: 3, stress: 30 },
                    { id: 'ee_isl201', name: 'Professional Ethics (ISL 201)', hours: 2, stress: 20 },
                    { id: 'ee_cse221', name: 'Digital Logic Design (CSE 221)', hours: 3, stress: 40 },
                    { id: 'ee_circ1', name: 'Electrical Circuits I (EE 201)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'ee_ma203', name: 'Differential Equations (MA 203)', hours: 3, stress: 45 },
                    { id: 'ee_cse201', name: 'Data Science (CSE 201)', hours: 3, stress: 35 },
                    { id: 'ee_arb201', name: 'Literary Styles (ARB 201)', hours: 2, stress: 20 },
                    { id: 'ee_elec1', name: 'Electronics I (EE 202)', hours: 3, stress: 40 },
                    { id: 'ee_elec1_lab', name: 'Electronics I Lab (EE 203)', hours: 1, stress: 25 },
                    { id: 'ee_signals', name: 'Signals and Systems (EE 204)', hours: 3, stress: 45 },
                    { id: 'ee_circ2', name: 'Electric Circuits II (EE 205)', hours: 2, stress: 40 },
                    { id: 'ee_circ2_lab', name: 'Electric Circuits II Lab (EE 206)', hours: 1, stress: 25 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'ee_ai', name: 'Intro to Artificial Intelligence (CSE 301)', hours: 3, stress: 40 },
                    { id: 'ee_isl301', name: 'Human Right in Islam (ISL 301)', hours: 2, stress: 15 },
                    { id: 'ee_phy321', name: 'Electricity and Magnetism (PHY 321)', hours: 3, stress: 45 },
                    { id: 'ee_elec2', name: 'Electronics II (EE 301)', hours: 3, stress: 45 },
                    { id: 'ee_power', name: 'Electrical Energy Engineering (EE 302)', hours: 3, stress: 45 },
                    { id: 'ee_power_lab', name: 'Electrical Energy Engineering Lab (EE 303)', hours: 1, stress: 25 },
                    { id: 'ee_control', name: 'Control Engineering (EE 304)', hours: 3, stress: 50 },
                    { id: 'ee_control_lab', name: 'Control Engineering Lab (EE 305)', hours: 1, stress: 25 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'ee_num', name: 'Numerical Methods (MA 301)', hours: 3, stress: 40 },
                    { id: 'ee_bus', name: 'Business & Entrepreneurship (MS 301)', hours: 2, stress: 25 },
                    { id: 'ee_design_des', name: 'Fundamentals of Electrical Engineering Design (EE 306)', hours: 3, stress: 40 },
                    { id: 'ee_comm', name: 'Communications Engineering (EE 307)', hours: 3, stress: 45 },
                    { id: 'ee_comm_lab', name: 'Communications Engineering Lab (EE 308)', hours: 1, stress: 25 },
                    { id: 'ee_dig_sys', name: 'Digital Systems Engineering (EE 309)', hours: 3, stress: 45 },
                    { id: 'ee_dig_lab', name: 'Digital Systems Engineering Lab (EE 310)', hours: 1, stress: 25 },
                    { id: 'ee_design1', name: 'Design Project I (EE 300)', hours: 2, stress: 40 }
                ]
            }
        ]
    },
    mkt: {
        name: 'التسويق (MKT)',
        category: 'بكالوريوس',
        color: '#6B5744',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'mkt_econ', name: 'Microeconomics (ECON 101)', hours: 3, stress: 30 },
                    { id: 'mkt_engl101', name: 'English Composition I (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'mkt_islm101', name: 'Islamic Ideology and Thought (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'mkt_math', name: 'Calculus for Management (MATH 111)', hours: 4, stress: 35 },
                    { id: 'mkt_mgt', name: 'Principles of Management (MGT 211)', hours: 3, stress: 25 },
                    { id: 'mkt_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'mkt_acct1', name: 'Financial Accounting I (ACCT 110)', hours: 3, stress: 40 },
                    { id: 'mkt_engl102', name: 'English Composition II (ENGL 102)', hours: 3, stress: 25 },
                    { id: 'mkt_islm201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 },
                    { id: 'mkt_mis', name: 'Principles of MIS (MIS 203)', hours: 3, stress: 30 },
                    { id: 'mkt_core', name: 'Principles of Marketing (MKT 211)', hours: 3, stress: 25 },
                    { id: 'mkt_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 },
                    { id: 'mkt_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'mkt_acct2', name: 'Managerial Accounting (ACCT 212)', hours: 3, stress: 40 },
                    { id: 'mkt_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 },
                    { id: 'mkt_econ2', name: 'Macroeconomics (ECON 102)', hours: 3, stress: 30 },
                    { id: 'mkt_engl211', name: 'Business Report Writing (ENGL 211)', hours: 3, stress: 25 },
                    { id: 'mkt_sosc', name: 'Behavioral Science in Business (SOSC 101)', hours: 3, stress: 25 },
                    { id: 'mkt_stat1', name: 'Statistics for Management I (STAT 211)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'mkt_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 },
                    { id: 'mkt_engl212', name: 'Business Communication (ENGL 212)', hours: 3, stress: 25 },
                    { id: 'mkt_mgt212', name: 'Quantitative Analysis for Mgt. (MGT 212)', hours: 3, stress: 45 },
                    { id: 'mkt_hr', name: 'Human Resource Management (MGT 213)', hours: 3, stress: 30 },
                    { id: 'mkt_ops', name: 'Operations Management (MGT 214)', hours: 3, stress: 45 },
                    { id: 'mkt_stat2', name: 'Statistics for Management II (STAT 311)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'mkt_fin', name: 'Principles of Finance (FIN 220)', hours: 3, stress: 40 },
                    { id: 'mkt_law', name: 'Business Law (MGT 315)', hours: 3, stress: 35 },
                    { id: 'mkt_entre', name: 'Entrepreneurship (MGT 316)', hours: 3, stress: 35 },
                    { id: 'mkt_beh', name: 'Consumer Behaviour (MKT 321)', hours: 3, stress: 30 },
                    { id: 'mkt_reser', name: 'Marketing Research (MKT 322)', hours: 3, stress: 40 },
                    { id: 'mkt_work_ethics', name: 'Work Ethics in Islam (ISLM 301)', hours: 2, stress: 15 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'mkt_global', name: 'International Global Business (MGT 317)', hours: 3, stress: 35 },
                    { id: 'mkt_prod', name: 'New Product Development & Pricing (MKT 323)', hours: 3, stress: 40 },
                    { id: 'mkt_comm', name: 'Integrated Marketing Communication (MKT 324)', hours: 3, stress: 40 },
                    { id: 'mkt_scm', name: 'Supply Chain Management (MKT 325)', hours: 3, stress: 35 },
                    { id: 'mkt_major_elec', name: 'Major Elective I', hours: 3, stress: 35 },
                    { id: 'mkt_gen_elec', name: 'General Elective', hours: 3, stress: 30 }
                ]
            }
        ]
    },
    acct: {
        name: 'المحاسبة (ACCT)',
        category: 'بكالوريوس',
        color: '#2C3531',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'acct_econ1', name: 'Microeconomics (ECON 101)', hours: 3, stress: 30 },
                    { id: 'acct_engl101', name: 'English Composition I (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'acct_islm101', name: 'Islamic Ideology and Thought (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'acct_math', name: 'Calculus for Management (MATH 111)', hours: 4, stress: 35 },
                    { id: 'acct_mgt1', name: 'Principles of Management (MGT 211)', hours: 3, stress: 25 },
                    { id: 'acct_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'acct_base', name: 'Financial Accounting I (ACCT 110)', hours: 3, stress: 45 },
                    { id: 'acct_engl102', name: 'English Composition II (ENGL 102)', hours: 3, stress: 25 },
                    { id: 'acct_islm201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 },
                    { id: 'acct_mis', name: 'Principles Of MIS (MIS 203)', hours: 3, stress: 30 },
                    { id: 'acct_econ2', name: 'Macroeconomics (ECON 102)', hours: 3, stress: 30 },
                    { id: 'acct_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 },
                    { id: 'acct_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'acct_f2', name: 'Financial Accounting II (ACCT 211)', hours: 2, stress: 35 },
                    { id: 'acct_mg', name: 'Managerial Accounting (ACCT 242)', hours: 3, stress: 45 },
                    { id: 'acct_mkt', name: 'Principles of Marketing (MKT 211)', hours: 3, stress: 25 },
                    { id: 'acct_engl211', name: 'Business Report Writing (ENGL 211)', hours: 3, stress: 25 },
                    { id: 'acct_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 },
                    { id: 'acct_stat1', name: 'Statistics for Management I (STAT 211)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'acct_inter', name: 'Intermediate Accounting (ACCT 214)', hours: 3, stress: 50 },
                    { id: 'acct_fin220', name: 'Principles Of Finance (FIN 220)', hours: 3, stress: 40 },
                    { id: 'acct_mgt2', name: 'Research Methodology (MGT 212)', hours: 3, stress: 40 },
                    { id: 'acct_mgt214', name: 'Operations Management (MGT 214)', hours: 3, stress: 45 },
                    { id: 'acct_engl212', name: 'Business Communication (ENGL 212)', hours: 3, stress: 30 },
                    { id: 'acct_stat2', name: 'Statistics for Management II (STAT 311)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'acct_cost', name: 'Cost Accounting (ACCT 315)', hours: 3, stress: 50 },
                    { id: 'acct_fin312', name: 'Corporate Finance (FIN 312)', hours: 3, stress: 45 },
                    { id: 'acct_oil', name: 'Oil and Gas Accounting (ACCT 316)', hours: 3, stress: 45 },
                    { id: 'acct_sys', name: 'Accounting Information Systems (ACCT 322)', hours: 3, stress: 40 },
                    { id: 'acct_law', name: 'Business Law (MGT 315)', hours: 3, stress: 35 },
                    { id: 'acct_work_ethics', name: 'Work Ethics in Islam (ISLM 301)', hours: 2, stress: 15 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'acct_forensic', name: 'Forensic Accounting (ACCT 317)', hours: 3, stress: 45 },
                    { id: 'acct_intl', name: 'International Accounting (ACCT 319)', hours: 3, stress: 45 },
                    { id: 'acct_gov', name: 'Accounting for Government and Non-profit Organizations (ACCT 323)', hours: 3, stress: 45 },
                    { id: 'acct_major_elec', name: 'Major Elective I', hours: 3, stress: 35 },
                    { id: 'acct_gen_elec', name: 'General Elective I', hours: 3, stress: 30 },
                    { id: 'acct_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 }
                ]
            }
        ]
    },
    hrm: {
        name: 'الموارد البشرية (HRM)',
        category: 'بكالوريوس',
        color: '#C4863A',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'hrm_engl101', name: 'English Composition I (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'hrm_math', name: 'Calculus for Management (MATH 111)', hours: 4, stress: 35 },
                    { id: 'hrm_mgt1', name: 'Principles of Management (MGT 211)', hours: 3, stress: 25 },
                    { id: 'hrm_econ1', name: 'Microeconomics (ECON 101)', hours: 3, stress: 30 },
                    { id: 'hrm_islm101', name: 'Islamic Ideology and Thought (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'hrm_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'hrm_engl102', name: 'English Composition II (ENGL 102)', hours: 3, stress: 25 },
                    { id: 'hrm_mis', name: 'Principles Of MIS (MIS 203)', hours: 3, stress: 30 },
                    { id: 'hrm_acct1', name: 'Financial Accounting I (ACCT 110)', hours: 3, stress: 40 },
                    { id: 'hrm_mkt', name: 'Principles of Marketing (MKT 211)', hours: 3, stress: 25 },
                    { id: 'hrm_islm201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 },
                    { id: 'hrm_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 },
                    { id: 'hrm_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'hrm_engl211', name: 'Business Report Writing (ENGL 211)', hours: 3, stress: 25 },
                    { id: 'hrm_stat1', name: 'Statistics for Management I (STAT 211)', hours: 3, stress: 40 },
                    { id: 'hrm_acct2', name: 'Managerial Accounting (ACCT 212)', hours: 3, stress: 40 },
                    { id: 'hrm_sosc', name: 'Behavioral Science in Business (SOSC 101)', hours: 3, stress: 25 },
                    { id: 'hrm_econ2', name: 'Macroeconomics (ECON 102)', hours: 3, stress: 30 },
                    { id: 'hrm_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'hrm_engl212', name: 'Business Communication (ENGL 212)', hours: 3, stress: 30 },
                    { id: 'hrm_mgt2', name: 'Research Methodology (MGT 212)', hours: 3, stress: 40 },
                    { id: 'hrm_stat2', name: 'Statistics for Management II (STAT 311)', hours: 3, stress: 40 },
                    { id: 'hrm_ops', name: 'Operations Management (MGT 214)', hours: 3, stress: 45 },
                    { id: 'hrm_core', name: 'Human Resource Management (MGT 213)', hours: 3, stress: 25 },
                    { id: 'hrm_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'hrm_law', name: 'Business Law (MGT 315)', hours: 3, stress: 35 },
                    { id: 'hrm_entre', name: 'Entrepreneurship (MGT 316)', hours: 3, stress: 35 },
                    { id: 'hrm_fin', name: 'Principles of Finance (FIN 220)', hours: 3, stress: 40 },
                    { id: 'hrm_plan', name: 'HR Planning and Acquisition (HRM 321)', hours: 3, stress: 35 },
                    { id: 'hrm_comp', name: 'Compensation and Performance Management (HRM 322)', hours: 3, stress: 35 },
                    { id: 'hrm_work_ethics', name: 'Work Ethics in Islam (ISLM 301)', hours: 2, stress: 15 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'hrm_global', name: 'International/Global Business (MGT 317)', hours: 3, stress: 35 },
                    { id: 'hrm_dev', name: 'Training and Development (HRM 320)', hours: 3, stress: 30 },
                    { id: 'hrm_change', name: 'Organization Development and Change Management (HRM 324)', hours: 3, stress: 35 },
                    { id: 'hrm_issues', name: 'Issues and Development in HRM (HRM 325)', hours: 3, stress: 35 },
                    { id: 'hrm_major_elec', name: 'Major Elective I', hours: 3, stress: 35 },
                    { id: 'hrm_gen_elec', name: 'General Elective I', hours: 3, stress: 30 }
                ]
            }
        ]
    },
    mis: {
        name: 'نظم المعلومات الإدارية (MIS)',
        category: 'بكالوريوس',
        color: '#7C9E6B',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'mis_econ1', name: 'Microeconomics (ECON 101)', hours: 3, stress: 30 },
                    { id: 'mis_engl101', name: 'English Composition I (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'mis_islm101', name: 'Islamic Ideology and Thought (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'mis_math1', name: 'Calculus for Management (MATH 111)', hours: 4, stress: 35 },
                    { id: 'mis_mgt1', name: 'Principles of Management (MGT 211)', hours: 3, stress: 25 },
                    { id: 'mis_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'mis_acct1', name: 'Financial Accounting I (ACCT 110)', hours: 3, stress: 40 },
                    { id: 'mis_engl102', name: 'English Composition II (ENGL 102)', hours: 3, stress: 25 },
                    { id: 'mis_islm201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 },
                    { id: 'mis_mkt211', name: 'Principles of Marketing (MKT 211)', hours: 3, stress: 25 },
                    { id: 'mis_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 },
                    { id: 'mis_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 },
                    { id: 'mis_base', name: 'Principles Of MIS (MIS 203)', hours: 3, stress: 30 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'mis_acct2', name: 'Managerial Accounting (ACCT 212)', hours: 3, stress: 40 },
                    { id: 'mis_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 },
                    { id: 'mis_econ102', name: 'Macroeconomics (ECON 102)', hours: 3, stress: 30 },
                    { id: 'mis_engl211', name: 'Business Report Writing (ENGL 211)', hours: 3, stress: 25 },
                    { id: 'mis_math112', name: 'Calculus for Management II (MATH 112)', hours: 4, stress: 40 },
                    { id: 'mis_prog_intro', name: 'Introduction to Computer Programming (MIS 101)', hours: 3, stress: 35 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'mis_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 },
                    { id: 'mis_engl212', name: 'Business Communication (ENGL 212)', hours: 3, stress: 30 },
                    { id: 'mis_mgt212', name: 'Research Methodology (MGT 212)', hours: 3, stress: 40 },
                    { id: 'mis_info102', name: 'Introduction to Informatics (MIS 102)', hours: 3, stress: 35 },
                    { id: 'mis_data', name: 'Data Management (MIS 202)', hours: 3, stress: 35 },
                    { id: 'mis_stat1', name: 'Statistics for Management I (STAT 211)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'mis_fin', name: 'Principles of Finance (FIN 220)', hours: 3, stress: 40 },
                    { id: 'mis_mgt315', name: 'Business Law (MGT 315)', hours: 3, stress: 35 },
                    { id: 'mis_data_struct', name: 'Data & Information Structures (MIS 201)', hours: 3, stress: 40 },
                    { id: 'mis_net', name: 'Business Data Communication & Networking (MIS 340)', hours: 3, stress: 40 },
                    { id: 'mis_sad1', name: 'System Analysis & Design I (MIS 341)', hours: 3, stress: 40 },
                    { id: 'mis_stat2', name: 'Statistics for Management II (STAT 311)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'mis_work_ethics', name: 'Work Ethics in Islam (ISLM 301)', hours: 2, stress: 15 },
                    { id: 'mis_ops', name: 'Operations Management (MGT 214)', hours: 3, stress: 45 },
                    { id: 'mis_gen_elec', name: 'General Elective I', hours: 3, stress: 30 },
                    { id: 'mis_sad2', name: 'System Analysis & Design II (MIS 342)', hours: 3, stress: 45 },
                    { id: 'mis_ecom', name: 'Principles of E-Commerce (MIS 343)', hours: 3, stress: 35 },
                    { id: 'mis_spec_elec', name: 'MIS Specialization Elective I', hours: 3, stress: 35 }
                ]
            }
        ]
    },
    scm: {
        name: 'سلاسل الإمداد (SCM)',
        category: 'بكالوريوس',
        color: '#8B5E3C',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'scm_econ1', name: 'Microeconomics (ECON 101)', hours: 3, stress: 30 },
                    { id: 'scm_engl101', name: 'English Composition I (ENGL 101)', hours: 3, stress: 25 },
                    { id: 'scm_islm101', name: 'Islamic Ideology and Thought (ISLM 101)', hours: 2, stress: 15 },
                    { id: 'scm_math', name: 'Calculus for Management (MATH 111)', hours: 4, stress: 35 },
                    { id: 'scm_mgt1', name: 'Principles of Management (MGT 211)', hours: 3, stress: 25 },
                    { id: 'scm_pe101', name: 'Physical Education I (PE 101)', hours: 1, stress: 10 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'scm_acct1', name: 'Financial Accounting I (ACCT 110)', hours: 3, stress: 40 },
                    { id: 'scm_engl102', name: 'English Composition II (ENGL 102)', hours: 3, stress: 25 },
                    { id: 'scm_islm201', name: 'Human Rights in Islam (ISLM 201)', hours: 2, stress: 15 },
                    { id: 'scm_mis', name: 'Principles Of MIS (MIS 203)', hours: 3, stress: 30 },
                    { id: 'scm_mkt', name: 'Principles of Marketing (MKT 211)', hours: 3, stress: 25 },
                    { id: 'scm_pe102', name: 'Physical Education II (PE 102)', hours: 1, stress: 10 },
                    { id: 'scm_arab101', name: 'Functional Grammar (ARAB 101)', hours: 2, stress: 20 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'scm_acct2', name: 'Managerial Accounting (ACCT 212)', hours: 3, stress: 40 },
                    { id: 'scm_arab201', name: 'Objective Writing (ARAB 201)', hours: 2, stress: 20 },
                    { id: 'scm_econ102', name: 'Macroeconomics (ECON 102)', hours: 3, stress: 30 },
                    { id: 'scm_engl211', name: 'Business Report Writing (ENGL 211)', hours: 3, stress: 25 },
                    { id: 'scm_sosc101', name: 'Behavioral Science in Business (SOSC 101)', hours: 3, stress: 25 },
                    { id: 'scm_stat1', name: 'Statistics for Management I (STAT 211)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'scm_arab301', name: 'Arabic Communication (ARAB 301)', hours: 2, stress: 20 },
                    { id: 'scm_engl212', name: 'Business Communication (ENGL 212)', hours: 3, stress: 30 },
                    { id: 'scm_mgt212', name: 'Research Methodology (MGT 212)', hours: 3, stress: 40 },
                    { id: 'scm_hr', name: 'Human Resource Management (MGT 213)', hours: 3, stress: 25 },
                    { id: 'scm_ops', name: 'Operations Management (MGT 214)', hours: 3, stress: 45 },
                    { id: 'scm_stat2', name: 'Statistics for Management II (STAT 311)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الأول',
                courses: [
                    { id: 'scm_fin', name: 'Principles of Finance (FIN 220)', hours: 3, stress: 40 },
                    { id: 'scm_work_ethics', name: 'Work Ethics in Islam (ISLM 301)', hours: 2, stress: 15 },
                    { id: 'scm_law', name: 'Business Law (MGT 315)', hours: 3, stress: 35 },
                    { id: 'scm_entre', name: 'Entrepreneurship (MGT 316)', hours: 3, stress: 35 },
                    { id: 'scm_fund', name: 'Fundamentals of Supply Chain Management (SCM 321)', hours: 3, stress: 35 },
                    { id: 'scm_proc', name: 'Procurement Management (SCM 322)', hours: 3, stress: 35 }
                ]
            },
            {
                termName: 'السنة الثالثة - الفصل الثاني',
                courses: [
                    { id: 'scm_intl_biz', name: 'International Business (MGT 317)', hours: 3, stress: 35 },
                    { id: 'scm_inv', name: 'Inventory Management (SCM 323)', hours: 3, stress: 35 },
                    { id: 'scm_ware', name: 'Warehouse Management (SCM 324)', hours: 3, stress: 35 },
                    { id: 'scm_log', name: 'Logistics Management (SCM 325)', hours: 3, stress: 35 },
                    { id: 'scm_gen_elec', name: 'General Elective I', hours: 3, stress: 30 },
                    { id: 'scm_major_elec', name: 'Major Elective I', hours: 3, stress: 35 }
                ]
            }
        ]
    },
    dip_ept: {
        name: 'دبلوم تقنية القوى الكهربائية (EPT)',
        category: 'دبلوم',
        color: '#8B5E3C',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'ept_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'ept_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'ept_gsph101', name: 'General Physics (GSPH 101)', hours: 3, stress: 40 },
                    { id: 'ept_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'ept_elet101', name: 'Electrical Circuits I (ELET 101)', hours: 3, stress: 40 },
                    { id: 'ept_elet104', name: 'Computer Programming (ELET 104)', hours: 3, stress: 35 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'ept_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'ept_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'ept_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'ept_elet102', name: 'Electrical Circuits II (ELET 102)', hours: 3, stress: 45 },
                    { id: 'ept_elet103', name: 'Electrical Machines I (ELET 103)', hours: 3, stress: 40 },
                    { id: 'ept_elet105', name: 'Electronics I (ELET 105)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'ept_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'ept_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'ept_elet201', name: 'Basic Industrial Electronics (ELET 201)', hours: 3, stress: 40 },
                    { id: 'ept_elet202', name: 'Digital Electronics I (ELET 202)', hours: 2, stress: 40 },
                    { id: 'ept_elet203', name: 'Control System Components (ELET 203)', hours: 3, stress: 45 },
                    { id: 'ept_elet221', name: 'Electrical Installations (ELET 221)', hours: 3, stress: 40 },
                    { id: 'ept_elet222', name: 'Electrical Machines II (ELET 222)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'ept_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'ept_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'ept_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'ept_elet223', name: 'Electrical Motor Control (ELET 223)', hours: 3, stress: 45 },
                    { id: 'ept_elet224', name: 'Electrical Power Systems (ELET 224)', hours: 4, stress: 50 },
                    { id: 'ept_elet225', name: 'Electrical Trbl Shtg & Maint (ELET 225)', hours: 4, stress: 50 }
                ]
            }
        ]
    },
    dip_ict: {
        name: 'دبلوم تقنية الأجهزة والتحكم (ICT)',
        category: 'دبلوم',
        color: '#7C9E6B',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'ict_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'ict_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'ict_gsph101', name: 'General Physics (GSPH 101)', hours: 4, stress: 40 },
                    { id: 'ict_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'ict_elet101', name: 'Electric Circuit I (ELET 101)', hours: 3, stress: 40 },
                    { id: 'ict_elet104', name: 'Computer Programming (ELET 104)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'ict_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'ict_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'ict_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'ict_elet102', name: 'Electrical Circuits II (ELET 102)', hours: 3, stress: 45 },
                    { id: 'ict_elet103', name: 'Electrical Machines I (ELET 103)', hours: 3, stress: 40 },
                    { id: 'ict_elet105', name: 'Electronics I (ELET 105)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'ict_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'ict_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'ict_elet201', name: 'Basic Industrial Electronics (ELET 201)', hours: 3, stress: 40 },
                    { id: 'ict_elet202', name: 'Digital Electronics I (ELET 202)', hours: 2, stress: 40 },
                    { id: 'ict_elet203', name: 'Control System Components (ELET 203)', hours: 3, stress: 45 },
                    { id: 'ict_elet211', name: 'Instrumentation Electronics (ELET 211)', hours: 3, stress: 45 },
                    { id: 'ict_elet241', name: 'Process Instrumentation (ELET 241)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'ict_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'ict_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'ict_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'ict_elet212', name: 'Microcontroller (ELET 212)', hours: 2, stress: 40 },
                    { id: 'ict_elet242', name: 'Process Control Systems (ELET 242)', hours: 3, stress: 50 },
                    { id: 'ict_elet243', name: 'Instrumentation Trouble Shooting & Maintenance (ELET 243)', hours: 4, stress: 50 },
                    { id: 'ict_cmet221', name: 'Analytical Instrumentation (CMET 221)', hours: 2, stress: 45 }
                ]
            }
        ]
    },
    dip_pocat: {
        name: 'دبلوم العمليات الكيميائية (POCAT)',
        category: 'دبلوم',
        color: '#8B5E3C',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'pocat_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'pocat_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'pocat_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'pocat_engt101', name: 'Engineering Drafting (ENGT 101)', hours: 2, stress: 30 },
                    { id: 'pocat_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'pocat_cmet101', name: 'Intro. to Chem. Engg. Tech (CMET 101)', hours: 3, stress: 35 },
                    { id: 'pocat_cmet105', name: 'Fluid Mechanics (CMET 105)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'pocat_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'pocat_gsph101', name: 'General Physics (GSPH 101)', hours: 4, stress: 40 },
                    { id: 'pocat_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'pocat_cmet102', name: 'Methods of Chem. Analysis (CMET 102)', hours: 3, stress: 45 },
                    { id: 'pocat_cmet103', name: 'Applied Organic Chemistry (CMET 103)', hours: 3, stress: 40 },
                    { id: 'pocat_cmet106', name: 'Process Heat Transfer (CMET 106)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'pocat_elet104', name: 'Computer Programming (ELET 104)', hours: 2, stress: 35 },
                    { id: 'pocat_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'pocat_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'pocat_cmet202', name: 'Chem. Engg. Thermodynamics (CMET 202)', hours: 3, stress: 50 },
                    { id: 'pocat_cmet205', name: 'Mass Transfer Operations (CMET 205)', hours: 3, stress: 50 },
                    { id: 'pocat_cmet231', name: 'Petroleum Refining & Testing (CMET 231)', hours: 4, stress: 50 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'pocat_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'pocat_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'pocat_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'pocat_cmet203', name: 'Environmental Pollution (CMET 203)', hours: 3, stress: 40 },
                    { id: 'pocat_cmet204', name: 'Process Inst. & Control (CMET 204)', hours: 3, stress: 50 },
                    { id: 'pocat_cmet232', name: 'Petrochemicals (CMET 232)', hours: 4, stress: 50 }
                ]
            }
        ]
    },
    dip_mmt: {
        name: 'دبلوم الصيانة الميكانيكية (MMT)',
        category: 'دبلوم',
        color: '#7C9E6B',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'mmt_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'mmt_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'mmt_engt101', name: 'Engineering Drafting (ENGT 101)', hours: 2, stress: 30 },
                    { id: 'mmt_gsph101', name: 'General Physics (GSPH 101)', hours: 4, stress: 40 },
                    { id: 'mmt_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'mmt_mcet101', name: 'Plant Maintenance (MCET 101)', hours: 3, stress: 35 },
                    { id: 'mmt_mcet102', name: 'Mechanical Measurements (MCET 102)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'mmt_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'mmt_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'mmt_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'mmt_mcet103', name: 'Machining Processes I (MCET 103)', hours: 3, stress: 40 },
                    { id: 'mmt_mcet104', name: 'Materials Technology (MCET 104)', hours: 3, stress: 35 },
                    { id: 'mmt_mcet105', name: 'Applied Statics (MCET 105)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'mmt_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'mmt_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'mmt_elet204', name: 'Industrial Electricity (ELET 204)', hours: 3, stress: 40 },
                    { id: 'mmt_mcet201', name: 'Mechanical Drafting (MCET 201)', hours: 2, stress: 35 },
                    { id: 'mmt_mcet211', name: 'Applied Thermodynamics (MCET 211)', hours: 3, stress: 45 },
                    { id: 'mmt_mcet212', name: 'Fluid Machines (MCET 212)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'mmt_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'mmt_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'mmt_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'mmt_mcet213', name: 'Equipment Maintenance (MCET 213)', hours: 4, stress: 50 },
                    { id: 'mmt_mcet214', name: 'Heat Exchangers (MCET 214)', hours: 3, stress: 45 },
                    { id: 'mmt_elect', name: 'Technical Elective', hours: 3, stress: 35 }
                ]
            }
        ]
    },
    dip_mt: {
        name: 'دبلوم تقنية التصنيع (MT)',
        category: 'دبلوم',
        color: '#C4863A',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'mt_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'mt_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'mt_engt101', name: 'Engineering Drafting (ENGT 101)', hours: 2, stress: 30 },
                    { id: 'mt_gsph101', name: 'General Physics (GSPH 101)', hours: 4, stress: 40 },
                    { id: 'mt_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'mt_mcet101', name: 'Plant Maintenance (MCET 101)', hours: 3, stress: 35 },
                    { id: 'mt_mcet102', name: 'Mechanical Measurements (MCET 102)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'mt_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'mt_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'mt_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'mt_mcet103', name: 'Machining Processes I (MCET 103)', hours: 3, stress: 40 },
                    { id: 'mt_mcet104', name: 'Materials Technology (MCET 104)', hours: 3, stress: 35 },
                    { id: 'mt_mcet105', name: 'Applied Statics (MCET 105)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'mt_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'mt_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'mt_elet104', name: 'Computer Programming (ELET 104)', hours: 2, stress: 35 },
                    { id: 'mt_elet204', name: 'Industrial Electricity (ELET 204)', hours: 3, stress: 40 },
                    { id: 'mt_mcet201', name: 'Mechanical Drafting (MCET 201)', hours: 2, stress: 35 },
                    { id: 'mt_mcet221', name: 'Machining Processes II (MCET 221)', hours: 3, stress: 45 },
                    { id: 'mt_mcet222', name: 'Applied Strength of Materials (MCET 222)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'mt_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'mt_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'mt_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'mt_mcet211', name: 'Applied Thermodynamics (MCET 211)', hours: 3, stress: 45 },
                    { id: 'mt_mcet224', name: 'Inspection and Quality Control (MCET 224)', hours: 2, stress: 40 },
                    { id: 'mt_mcet226', name: 'Welding Technology (MCET 226)', hours: 2, stress: 40 },
                    { id: 'mt_elect', name: 'Technical Elective', hours: 3, stress: 35 }
                ]
            }
        ]
    },
    dip_mect: {
        name: 'دبلوم تقنية الميكاترونكس (MeCT)',
        category: 'دبلوم',
        color: '#2C3531',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'mect_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'mect_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'mect_gsph101', name: 'General Physics (GSPH 101)', hours: 4, stress: 40 },
                    { id: 'mect_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'mect_elet101', name: 'Electrical Circuits I (ELET 101)', hours: 3, stress: 40 },
                    { id: 'mect_elet104', name: 'Computer Programming (ELET 104)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'mect_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'mect_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'mect_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'mect_elet102', name: 'Electrical Circuits II (ELET 102)', hours: 3, stress: 45 },
                    { id: 'mect_mcet104', name: 'Materials Technology (MCET 104)', hours: 3, stress: 35 },
                    { id: 'mect_mcet105', name: 'Applied Statics (MCET 105)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'mect_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'mect_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'mect_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'mect_elet202', name: 'Digital Electronics I (ELET 202)', hours: 3, stress: 40 },
                    { id: 'mect_elet203', name: 'Control System Components (ELET 203)', hours: 3, stress: 45 },
                    { id: 'mect_elet103', name: 'Electrical Machines I (ELET 103)', hours: 3, stress: 40 },
                    { id: 'mect_mcet212', name: 'Fluid Machines (MCET 212)', hours: 3, stress: 45 },
                    { id: 'mect_mcet222', name: 'Applied Strength of Materials (MCET 222)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'mect_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'mect_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'mect_mcet103', name: 'Machining Processes I (MCET 103)', hours: 3, stress: 40 },
                    { id: 'mect_elet301', name: 'Applied Dynamics (ELET 301 / MCET 301)', hours: 3, stress: 45 },
                    { id: 'mect_maint', name: 'Maintenance and Reliability Engineering in Mechatronics (ELET 251)', hours: 2, stress: 40 },
                    { id: 'mect_sys_des', name: 'Introduction to Mechatronics System Design (ELET 252)', hours: 3, stress: 45 }
                ]
            }
        ]
    },
    dip_ect: {
        name: 'دبلوم الإلكترونيات والاتصالات (ECT)',
        category: 'دبلوم',
        color: '#6B5744',
        terms: [
            {
                termName: 'السنة الأولى - الفصل الأول',
                courses: [
                    { id: 'ect_eng101', name: 'English Communication (ENG 101)', hours: 2, stress: 25 },
                    { id: 'ect_gsma101', name: 'Calculus I (GSMA 101)', hours: 3, stress: 35 },
                    { id: 'ect_gsph101', name: 'General Physics (GSPH 101)', hours: 4, stress: 40 },
                    { id: 'ect_gspe101', name: 'Physical Education I (GSPE 101)', hours: 1, stress: 10 },
                    { id: 'ect_elet101', name: 'Electric Circuit I (ELET 101)', hours: 3, stress: 40 },
                    { id: 'ect_elet104', name: 'Computer Programming (ELET 104)', hours: 2, stress: 35 }
                ]
            },
            {
                termName: 'السنة الأولى - الفصل الثاني',
                courses: [
                    { id: 'ect_gsch101', name: 'General Chemistry (GSCH 101)', hours: 4, stress: 40 },
                    { id: 'ect_gsma102', name: 'Calculus II (GSMA 102)', hours: 3, stress: 40 },
                    { id: 'ect_eng102', name: 'English Composition (ENG 102)', hours: 2, stress: 25 },
                    { id: 'ect_elet102', name: 'Electrical Circuits II (ELET 102)', hours: 3, stress: 45 },
                    { id: 'ect_elet103', name: 'Electrical Machines I (ELET 103)', hours: 3, stress: 40 },
                    { id: 'ect_elet105', name: 'Electronics I (ELET 105)', hours: 3, stress: 40 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الأول',
                courses: [
                    { id: 'ect_gsst201', name: 'Applied Statistics (GSST 201)', hours: 2, stress: 40 },
                    { id: 'ect_engt201', name: 'Industrial Safety (ENGT 201)', hours: 1, stress: 30 },
                    { id: 'ect_engt202', name: 'Industrial Supervision (ENGT 202)', hours: 1, stress: 25 },
                    { id: 'ect_elet201', name: 'Basic Industrial Electronics (ELET 201)', hours: 3, stress: 40 },
                    { id: 'ect_elet202', name: 'Digital Electronics I (ELET 202)', hours: 2, stress: 40 },
                    { id: 'ect_elet203', name: 'Control System Components (ELET 203)', hours: 3, stress: 45 },
                    { id: 'ect_elet230', name: 'PCB Fabrication (ELET 230)', hours: 1, stress: 30 },
                    { id: 'ect_elet231', name: 'Electronics II (ELET 231)', hours: 3, stress: 45 }
                ]
            },
            {
                termName: 'السنة الثانية - الفصل الثاني',
                courses: [
                    { id: 'ect_eng201', name: 'Technical Report Writing (ENG 201)', hours: 3, stress: 30 },
                    { id: 'ect_gsis101', name: 'Islamic Ideology and Thoughts (GSIS 101)', hours: 2, stress: 15 },
                    { id: 'ect_elet212', name: 'Microcontroller (ELET 212)', hours: 2, stress: 40 },
                    { id: 'ect_elet232', name: 'Digital Electronics II (ELET 232)', hours: 3, stress: 45 },
                    { id: 'ect_elet233', name: 'Analog & Digital Communications (ELET 233)', hours: 3, stress: 50 },
                    { id: 'ect_elet234', name: 'Troubleshooting and Maintenance (ELET 234)', hours: 2, stress: 45 },
                    { id: 'ect_elet235', name: 'Telecommunication Systems (ELET 235)', hours: 3, stress: 45 }
                ]
            }
        ]
    }
};

export default function BurnoutMeterPage() {
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [selectedDept, setSelectedDept] = useState<string>('');
    const [isDeptSelectorOpen, setIsDeptSelectorOpen] = useState<boolean>(true);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const toggleCourse = (id: string) => {
        if (selectedCourses.includes(id)) {
            setSelectedCourses(selectedCourses.filter(c => c !== id));
        } else {
            setSelectedCourses([...selectedCourses, id]);
        }
    };

    const calculateBurnout = async () => {
        if (selectedCourses.length === 0 || !selectedDept) return;

        setLoading(true);
        setResult(null);

        try {
            let totalHours = 0;
            let totalStress = 0;
            const selectedCoursesDetails: any[] = [];
            const deptTerms = departmentsData[selectedDept].terms;

            deptTerms.forEach(term => {
                term.courses.forEach(course => {
                    if (selectedCourses.includes(course.id)) {
                        totalHours += course.hours;
                        totalStress += course.stress;
                        selectedCoursesDetails.push({
                            name: course.name,
                            hours: course.hours,
                            stressLevel: course.stress
                        });
                    }
                });
            });

            // حساب نسبة الحرق بناءً على معدل الساعات الواقعي (12 كحد أدنى و22 كحد أقصى)
            const hoursFactor = Math.min(Math.max((totalHours - 12) / (22 - 12), 0), 1);
            const avgStress = selectedCoursesDetails.length > 0 ? (totalStress / selectedCoursesDetails.length) : 0;

            const finalBurnout = Math.min(Math.round((avgStress * 0.6) + (hoursFactor * 40)), 100);

            // استدعاء الـ API مع إرسال الجنس لتوليد ألقاب مخصصة بالذكاء الاصطناعي
            const res = await fetch('/api/analyze-burnout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deptName: departmentsData[selectedDept].name,
                    totalHours,
                    finalBurnout,
                    selectedCoursesDetails,
                    gender
                })
            });

            if (!res.ok) throw new Error('فشل الاتصال بالخادم');

            const data = await res.json();
            setResult(data);

        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء تحليل الجدول عبر الذكاء الاصطناعي، حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const shareResult = () => {
        const text = `حسبت نسبة حرق الأعصاب لتخصصي (${result.deptName}) وطلع الدمار عندي ${result.finalBurnout}% ولقبي (${result.title}) 😂.. تعال احسب جدولك وشوف دمارك:`;
        if (navigator.share) {
            navigator.share({ title: 'مؤشر حرق الأعصاب', text, url: window.location.href });
        } else {
            navigator.clipboard.writeText(`${text} ${window.location.href}`);
            alert('✅ تم نسخ رابط التحدي! ارسله لقروب الدفعة 🔥');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf7', padding: '2rem 1rem', fontFamily: 'sans-serif', direction: 'rtl' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #6B5744', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>

                {/* زر العودة */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#8B5E3C', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        ← العودة للرئيسية
                    </Link>
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2C3531', textAlign: 'center', marginBottom: '0.5rem' }}>
                    🔥 مؤشر حرق الأعصاب الأكاديمي
                </h1>
                <p style={{ color: '#6B5744', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    قِس حجم الدمار النفسي لجدولك الدراسي بناءً على مواد تخصصك الحقيقية.
                </p>

                {/* المرحلة الأولى: اختيار الجنس (بنت / ولد) */}
                {!gender && (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <h3 style={{ color: '#2C3531', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            اختر التصنيف لنبدأ التحليل المخصص:
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                            <div
                                onClick={() => setGender('female')}
                                style={{
                                    border: '2px solid #cbd5e1',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    width: '160px',
                                    backgroundColor: '#fff',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5E3C'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👩‍🎓</div>
                                <span style={{ fontWeight: 'bold', color: '#2C3531', fontSize: '1rem' }}>طالبة (بنت)</span>
                            </div>

                            <div
                                onClick={() => setGender('male')}
                                style={{
                                    border: '2px solid #cbd5e1',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    width: '160px',
                                    backgroundColor: '#fff',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5E3C'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👨‍🎓</div>
                                <span style={{ fontWeight: 'bold', color: '#2C3531', fontSize: '1rem' }}>طالب (ولد)</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* المرحلة الثانية: اختيار التخصص وتحديد المواد */}
                {gender && !result && !loading && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', backgroundColor: '#f1f5f9', padding: '10px 15px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                                المسار المختار: <b>{gender === 'female' ? 'طالبة 👩‍🎓' : 'طالب 👨‍🎓'}</b>
                            </span>
                            <button
                                onClick={() => setGender(null)}
                                style={{ background: 'none', border: 'none', color: '#8B5E3C', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                            >
                                تغيير التصنيف 🔄
                            </button>
                        </div>

                        {/* اختيار التخصص */}
                        <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: '#6B5744', fontWeight: 'bold' }}>التخصص المختار:</span>
                                    <h3 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', color: '#2C3531' }}>
                                        {selectedDept ? departmentsData[selectedDept].name : '⚠️ لم تقرّر التخصص بعد'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsDeptSelectorOpen(!isDeptSelectorOpen)}
                                    style={{
                                        padding: '8px 14px',
                                        backgroundColor: '#FEECD0',
                                        color: '#8B5E3C',
                                        border: '1px solid #8B5E3C',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isDeptSelectorOpen ? 'إغلاق القائمة 🔼' : 'تغيير أو اختيار التخصص 🔄'}
                                </button>
                            </div>

                            {isDeptSelectorOpen && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                                    {Object.entries(departmentsData).map(([key, dept]) => {
                                        const isSelected = selectedDept === key;
                                        return (
                                            <div
                                                key={key}
                                                onClick={() => {
                                                    setSelectedDept(key);
                                                    setSelectedCourses([]);
                                                    setIsDeptSelectorOpen(false);
                                                }}
                                                style={{
                                                    padding: '10px 12px',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    border: isSelected ? '2px solid #8B5E3C' : '1px solid #cbd5e1',
                                                    backgroundColor: isSelected ? '#FEECD0' : '#ffffff',
                                                    color: isSelected ? '#8B5E3C' : '#2C3531',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    textAlign: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {dept.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* عرض المواد مرتبة حسب الفصول الدراسية */}
                        {selectedDept && !isDeptSelectorOpen && (
                            <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2C3531', marginBottom: '1rem' }}>
                                    📚 اختر المواد التي تدرسها هذا الترم (مرتبة حسب الفصول الدراسية):
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '480px', overflowY: 'auto', paddingLeft: '6px' }}>
                                    {departmentsData[selectedDept].terms.map((term, idx) => (
                                        <div key={idx} style={{ backgroundColor: '#fcfaf7', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#8B5E3C', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px' }}>
                                                📌 {term.termName}
                                            </h4>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
                                                {term.courses.map(course => {
                                                    const isSelected = selectedCourses.includes(course.id);
                                                    return (
                                                        <div
                                                            key={course.id}
                                                            onClick={() => toggleCourse(course.id)}
                                                            style={{
                                                                padding: '10px 12px',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                border: isSelected ? '2px solid #8B5E3C' : '1px solid #cbd5e1',
                                                                backgroundColor: isSelected ? '#FEECD0' : '#ffffff',
                                                                color: '#2C3531',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                fontWeight: 'bold',
                                                                fontSize: '0.8rem',
                                                                transition: 'all 0.15s'
                                                            }}
                                                        >
                                                            <span style={{ flex: 1, marginLeft: '8px', lineHeight: '1.3' }} title={course.name}>
                                                                {course.name}
                                                            </span>
                                                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#6B5744', flexShrink: 0 }}>
                                                                {course.hours} س
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedDept && !isDeptSelectorOpen && (
                            <button
                                onClick={calculateBurnout}
                                disabled={selectedCourses.length === 0}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: selectedCourses.length === 0 ? '#cbd5e1' : '#8B5E3C',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    cursor: selectedCourses.length === 0 ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                حلل دمار جدولي بالذكاء الاصطناعي 🚀
                            </button>
                        )}
                    </div>
                )}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠⚙️</div>
                        <p style={{ color: '#6B5744', fontWeight: 'bold' }}>جاري استخراج السجلات وحساب ضغط الساعات وتوليد التحليل...</p>
                    </div>
                )}

                {result && !loading && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B5744', fontWeight: 'bold' }}>التخصص: {result.deptName}</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6B5744' }}>إجمالي الساعات المحددة: {result.totalHours} ساعات</p>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#b91c1c', margin: '10px 0' }}>{result.finalBurnout}% 🔥</div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#b45309', marginBottom: '10px' }}>{result.title}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>{result.advice}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setResult(null)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#f1f5f9',
                                    color: '#334155',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                إعادة الاختيار 🔄
                            </button>
                            <button
                                onClick={shareResult}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: '#7C9E6B',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                تحدى خويك 📢
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}