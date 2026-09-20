'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { availableMajors, CourseItem } from './majorsData'

interface TimetableSlot {
    id: string
    day: 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس'
    timeSlotIndex: number
    span: number
    courseCode: string
    courseTitle: string
}

export default function AbsencePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
    const [selectedMajorId, setSelectedMajorId] = useState<string>('')
    const [isConfigured, setIsConfigured] = useState<boolean>(false)
    const [isEditingTimetable, setIsEditingTimetable] = useState<boolean>(false)
    const [expandedCourseCode, setExpandedCourseCode] = useState<string | null>(null)
    const [showLateHours, setShowLateHours] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<string>('')
    const [aiMessage, setAiMessage] = useState<string>('')
    const [notificationMessage, setNotificationMessage] = useState<string>('')

    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [pendingFilePreview, setPendingFilePreview] = useState<string | null>(null)

    const [activeCell, setActiveCell] = useState<{ day: 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس', timeIndex: number, slotId?: string } | null>(null)

    const baseTimeSlots = [
        '7 ← 8', '8:15', '9:15', '10:15', '11:15',
        '12:15', '1:15', '2:15', '3:15'
    ]
    const lateTimeSlots = ['4:15', '5:15', '6:15']
    const timeSlots = showLateHours ? [...baseTimeSlots, ...lateTimeSlots] : baseTimeSlots

    const daysOfWeek: ('الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس')[] = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

    const getTodayName = (): ('الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس') => {
        const jsDay = new Date().getDay()
        if (jsDay === 0) return 'الأحد'
        if (jsDay === 1) return 'الاثنين'
        if (jsDay === 2) return 'الثلاثاء'
        if (jsDay === 3) return 'الأربعاء'
        if (jsDay === 4) return 'الخميس'
        return 'الأحد'
    }

    const [selectedMobileDayIndex, setSelectedMobileDayIndex] = useState<number>(0)
    const mobileDaysContainerRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const today = getTodayName()
        const index = daysOfWeek.indexOf(today)
        if (index !== -1) {
            setSelectedMobileDayIndex(index)
        }
    }, [])

    const [selectedCourseCodes, setSelectedCourseCodes] = useState<string[]>([])
    const [courseAbsences, setCourseAbsences] = useState<Record<string, number>>({})
    const [coursePlannedAbsences, setCoursePlannedAbsences] = useState<Record<string, number>>({})
    const [absentSlots, setAbsentSlots] = useState<Record<string, boolean>>({})
    const [weeklyTimetable, setWeeklyTimetable] = useState<TimetableSlot[]>([])

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                setIsLoggedIn(true)
                setUserId(session.user.id)
                setUserEmail(session.user.email || null)

                const localDraft = localStorage.getItem('guest_timetable_draft')
                if (localDraft) {
                    try {
                        const parsedDraft = JSON.parse(localDraft)
                        await supabase
                            .from('student_absences')
                            .upsert({
                                user_id: session.user.id,
                                email: session.user.email || null,
                                major_id: parsedDraft.majorId || 'CS',
                                selected_courses: parsedDraft.selectedCourses || [],
                                actual_absences: parsedDraft.actuals || {},
                                planned_absences: parsedDraft.planneds || {},
                                absent_slots: parsedDraft.absentSlots || {},
                                weekly_timetable: parsedDraft.weeklyTimetable || [],
                                show_late_hours: parsedDraft.showLateHours || false,
                                updated_at: new Date()
                            }, { onConflict: 'user_id' })

                        localStorage.removeItem('guest_timetable_draft')
                    } catch (e) {
                        console.error('Error syncing guest draft:', e)
                    }
                }

                fetchUserData(session.user.id)
            } else {
                const localDraft = localStorage.getItem('guest_timetable_draft')
                if (localDraft) {
                    try {
                        const parsedDraft = JSON.parse(localDraft)
                        if (parsedDraft.majorId) setSelectedMajorId(parsedDraft.majorId)
                        if (parsedDraft.selectedCourses) setSelectedCourseCodes(parsedDraft.selectedCourses)
                        if (parsedDraft.actuals) setCourseAbsences(parsedDraft.actuals)
                        if (parsedDraft.planneds) setCoursePlannedAbsences(parsedDraft.planneds)
                        if (parsedDraft.absentSlots) setAbsentSlots(parsedDraft.absentSlots)
                        if (parsedDraft.showLateHours !== undefined) setShowLateHours(parsedDraft.showLateHours)
                        if (parsedDraft.weeklyTimetable) {
                            setWeeklyTimetable(parsedDraft.weeklyTimetable)
                            if (parsedDraft.showLateHours) {
                                setShowLateHours(true)
                            }
                        }
                        if (parsedDraft.selectedCourses && parsedDraft.selectedCourses.length > 0) {
                            setIsConfigured(true)
                        }
                    } catch (e) {
                        console.error('Error reading guest draft:', e)
                    }
                }
                setIsLoading(false)
            }
        })
    }, [])

    useEffect(() => {
        if (aiMessage) {
            const timer = setTimeout(() => {
                setAiMessage('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [aiMessage])

    useEffect(() => {
        if (notificationMessage) {
            const timer = setTimeout(() => {
                setNotificationMessage('')
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [notificationMessage])

    const fetchUserData = async (currentUserId: string, targetMajorHint?: string) => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('student_absences')
            .select('*')
            .eq('user_id', currentUserId)
            .single()

        if (!error && data) {
            const majorId = data.major_id || targetMajorHint || 'CS'
            setSelectedMajorId(majorId)

            const currentMajorObj = availableMajors.find(m => m.id === majorId) || availableMajors[0]
            const validCodes = currentMajorObj.semesters.flatMap(s => s.courses.map(c => c.code))

            if (data.selected_courses && Array.isArray(data.selected_courses)) {
                const rawCourses = data.selected_courses as string[]
                const cleanedCourses = Array.from(new Set(rawCourses.filter((code: string) => validCodes.includes(code))))
                setSelectedCourseCodes(cleanedCourses)
            }

            if (data.actual_absences) setCourseAbsences(data.actual_absences)
            if (data.planned_absences) setCoursePlannedAbsences(data.planned_absences)
            if (data.absent_slots) setAbsentSlots(data.absent_slots)
            if (data.weekly_timetable) setWeeklyTimetable(data.weekly_timetable)
            if (data.show_late_hours !== undefined) setShowLateHours(data.show_late_hours)

            if (data.selected_courses && data.selected_courses.length > 0) {
                setIsConfigured(true)
            }
        }
        setIsLoading(false)
    }

    const saveDataToSupabase = async (
        major: string,
        newSelected: string[],
        newActuals: Record<string, number>,
        newPlanneds: Record<string, number>,
        newSlots: Record<string, boolean>,
        newTable: TimetableSlot[],
        newShowLate?: boolean
    ) => {
        const currentLateStatus = newShowLate !== undefined ? newShowLate : showLateHours

        localStorage.setItem('guest_timetable_draft', JSON.stringify({
            majorId: major,
            selectedCourses: newSelected,
            actuals: newActuals,
            planneds: newPlanneds,
            absentSlots: newSlots,
            weeklyTimetable: newTable,
            showLateHours: currentLateStatus
        }))

        if (!userId) {
            setSaveStatus('⚠️ محفوظ محلياً (غير مسجل دخول)')
            setTimeout(() => setSaveStatus(''), 3000)
            return
        }

        setSaveStatus('⏳ جاري الحفظ...')

        const { error } = await supabase
            .from('student_absences')
            .upsert({
                user_id: userId,
                email: userEmail,
                major_id: major,
                selected_courses: newSelected,
                actual_absences: newActuals,
                planned_absences: newPlanneds,
                absent_slots: newSlots,
                weekly_timetable: newTable,
                show_late_hours: currentLateStatus,
                updated_at: new Date()
            }, { onConflict: 'user_id' })

        if (error) {
            console.error('Supabase Save Error:', error.message)
            setSaveStatus('❌ فشل الحفظ في القاعدة!')
        } else {
            setSaveStatus('✅ تم الحفظ بنجاح')
            setTimeout(() => setSaveStatus(''), 2500)
        }
    }

    const handleFileSelected = (file: File) => {
        setPendingFile(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setPendingFilePreview(reader.result as string)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        handleFileSelected(file)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files?.[0]
        if (!file) return
        handleFileSelected(file)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const executeAnalysis = async () => {
        if (!pendingFile) return

        setIsAnalyzing(true)
        const reader = new FileReader()
        reader.readAsDataURL(pendingFile)
        reader.onload = async () => {
            try {
                const base64Image = reader.result as string

                const currentMajorObj = availableMajors.find(m => m.id === selectedMajorId) || availableMajors[0]
                const allCoursesFlat = currentMajorObj ? currentMajorObj.semesters.flatMap(s => s.courses) : []

                const res = await fetch('/api/analyze-timetable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageBase64: base64Image,
                        type: 'parse_timetable',
                        availableCourses: allCoursesFlat
                    })
                })
                const result = await res.json()

                if (result.success && result.data && Array.isArray(result.data.slots)) {
                    const newSlots: TimetableSlot[] = result.data.slots
                    const apiCourses = (result.data.courses || []) as string[]
                    const extractedCodes: string[] = apiCourses.length > 0 ? apiCourses : Array.from(new Set(newSlots.map(s => s.courseCode)))

                    const mergedCodes = Array.from(new Set([...selectedCourseCodes, ...extractedCodes]))

                    let updatedLateStatus = showLateHours
                    if (newSlots.some(s => s.timeSlotIndex >= 9)) {
                        setShowLateHours(true)
                        updatedLateStatus = true
                    }

                    setSelectedCourseCodes(mergedCodes)
                    setWeeklyTimetable(newSlots)
                    setIsConfigured(true)
                    setPendingFile(null)
                    setPendingFilePreview(null)

                    await saveDataToSupabase(selectedMajorId || 'CS', mergedCodes, courseAbsences, coursePlannedAbsences, absentSlots, newSlots, updatedLateStatus)
                    setNotificationMessage('✨ تم تحليل الجدول وترتيب المواد والأوقات بدقة وتفعيل نظام الغياب!')
                } else {
                    setNotificationMessage('❌ لم نتمكن من تحليل الجدول، تأكد من وضوح الصورة.')
                }
            } catch (err) {
                console.error(err)
                setNotificationMessage('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.')
            } finally {
                setIsAnalyzing(false)
            }
        }
    }

    const handleSaveSelectedCourses = async () => {
        setIsConfigured(true)
        const validCodes = selectedCourseCodes
        const updatedTable = weeklyTimetable.filter(slot => validCodes.includes(slot.courseCode))

        setWeeklyTimetable(updatedTable)
        await saveDataToSupabase(selectedMajorId, validCodes, courseAbsences, coursePlannedAbsences, absentSlots, updatedTable)
    }

    const toggleCourseSelection = (code: string) => {
        const finalCodes = selectedCourseCodes.includes(code)
            ? selectedCourseCodes.filter(c => c !== code)
            : Array.from(new Set([...selectedCourseCodes, code]))

        setSelectedCourseCodes(finalCodes)
    }

    const toggleFullSemester = (semesterCourses: CourseItem[]) => {
        const codes = semesterCourses.map(c => c.code)
        const allIncluded = codes.every(code => selectedCourseCodes.includes(code))

        const finalCodes = allIncluded
            ? selectedCourseCodes.filter(code => !codes.includes(code))
            : Array.from(new Set([...selectedCourseCodes, ...codes]))

        setSelectedCourseCodes(finalCodes)
    }

    const toggleExpand = (code: string) => {
        setExpandedCourseCode(prev => (prev === code ? null : code))
    }

    const handleSelectCourseForCell = async (courseCode: string) => {
        if (!activeCell) return

        const currentMajorObj = availableMajors.find(m => m.id === selectedMajorId) || availableMajors[0]
        const allCoursesFlat = currentMajorObj ? currentMajorObj.semesters.flatMap(s => s.courses) : []
        const foundCourse = allCoursesFlat.find(c => c.code === courseCode)
        const courseTitle = foundCourse ? foundCourse.title : courseCode

        const newId = `${activeCell.day}-${activeCell.timeIndex}-${courseCode}-${Date.now()}`
        const filteredTable = weeklyTimetable.filter(s => !(s.day === activeCell.day && s.timeSlotIndex === activeCell.timeIndex))

        const newSlot: TimetableSlot = {
            id: newId,
            day: activeCell.day,
            timeSlotIndex: activeCell.timeIndex,
            span: 1,
            courseCode: courseCode,
            courseTitle: courseTitle
        }

        const updatedTable = [...filteredTable, newSlot]
        const updatedSelected = Array.from(new Set([...selectedCourseCodes, courseCode]))

        setWeeklyTimetable(updatedTable)
        setSelectedCourseCodes(updatedSelected)
        setActiveCell(null)

        await saveDataToSupabase(selectedMajorId, updatedSelected, courseAbsences, coursePlannedAbsences, absentSlots, updatedTable)
    }

    const handleRemoveSlot = async (slotId: string) => {
        const targetSlot = weeklyTimetable.find(s => s.id === slotId)
        const updatedTable = weeklyTimetable.filter(s => s.id !== slotId)

        const newAbsentSlots = { ...absentSlots }
        delete newAbsentSlots[slotId]

        let updatedSelected = [...selectedCourseCodes]
        if (targetSlot) {
            const courseStillExists = updatedTable.some(s => s.courseCode === targetSlot.courseCode)
            if (!courseStillExists) {
                updatedSelected = updatedSelected.filter(c => c !== targetSlot.courseCode)
            }
        }

        setWeeklyTimetable(updatedTable)
        setAbsentSlots(newAbsentSlots)
        setSelectedCourseCodes(updatedSelected)
        setActiveCell(null)

        await saveDataToSupabase(selectedMajorId, updatedSelected, courseAbsences, coursePlannedAbsences, newAbsentSlots, updatedTable)
    }

    const toggleSlotAbsence = async (slot: TimetableSlot) => {
        if (isEditingTimetable) {
            setActiveCell({ day: slot.day, timeIndex: slot.timeSlotIndex, slotId: slot.id })
            return
        }

        const isCurrentlyAbsent = !!absentSlots[slot.id]
        const newSlots = { ...absentSlots, [slot.id]: !isCurrentlyAbsent }
        setAbsentSlots(newSlots)

        const currentActuals = { ...courseAbsences }
        const courseCode = slot.courseCode
        const currentVal = currentActuals[courseCode] || 0
        const hoursToAdd = slot.span || 1

        const currentMajorObj = availableMajors.find(m => m.id === selectedMajorId) || availableMajors[0]
        const allCoursesFlat = currentMajorObj ? currentMajorObj.semesters.flatMap(s => s.courses) : []
        const foundCourse = allCoursesFlat.find(c => c.code === courseCode)
        const calculatedMaxAbsence = foundCourse ? foundCourse.maxAbsence : 9

        const updatedAbsentsCount = !isCurrentlyAbsent
            ? Math.min(calculatedMaxAbsence, currentVal + hoursToAdd)
            : Math.max(0, currentVal - hoursToAdd)

        currentActuals[courseCode] = updatedAbsentsCount
        setCourseAbsences(currentActuals)

        await saveDataToSupabase(selectedMajorId, selectedCourseCodes, currentActuals, coursePlannedAbsences, newSlots, weeklyTimetable)

        if (!isCurrentlyAbsent) {
            try {
                const res = await fetch('/api/analyze-timetable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'analyze_absence',
                        courseCode,
                        currentAbsents: updatedAbsentsCount,
                        maxAbsence: calculatedMaxAbsence
                    })
                })
                const aiRes = await res.json()
                if (aiRes.success && aiRes.message) {
                    setAiMessage(aiRes.message)
                } else {
                    setAiMessage(`تم تسجيل غياب ${courseCode}. غياباتك: ${updatedAbsentsCount}/${calculatedMaxAbsence}.`)
                }
            } catch (err) {
                console.error(err)
                setAiMessage(`تم تسجيل غياب ${courseCode}. غياباتك: ${updatedAbsentsCount}/${calculatedMaxAbsence}.`)
            }
        }
    }

    const updateAbsence = async (code: string, delta: number, maxLimit: number, isPlanned: boolean = false) => {
        let newActuals = { ...courseAbsences }
        let newPlanneds = { ...coursePlannedAbsences }

        if (isPlanned) {
            const current = newPlanneds[code] || 0
            newPlanneds[code] = Math.max(0, Math.min(maxLimit, current + delta))
            setCoursePlannedAbsences(newPlanneds)
        } else {
            const current = newActuals[code] || 0
            newActuals[code] = Math.max(0, Math.min(maxLimit, current + delta))
            setCourseAbsences(newActuals)
        }

        await saveDataToSupabase(selectedMajorId, selectedCourseCodes, newActuals, newPlanneds, absentSlots, weeklyTimetable)
    }

    const currentMajorObj = availableMajors.find(m => m.id === selectedMajorId) || availableMajors[0]
    const allCoursesFlat = currentMajorObj ? currentMajorObj.semesters.flatMap(s => s.courses) : []

    const combinedActiveCodes = Array.from(
        new Set([
            ...selectedCourseCodes,
            ...weeklyTimetable.map(slot => slot.courseCode)
        ])
    )
    const activeCoursesList = allCoursesFlat.filter(c => combinedActiveCodes.includes(c.code))

    const sortedActiveCourses = [...activeCoursesList].sort((a, b) => {
        if (a.code === expandedCourseCode) return -1
        if (b.code === expandedCourseCode) return 1
        return 0
    })

    const columnWidth = showLateHours ? '65px' : '90px'

    const bachelorsIds = ['CS', 'CSE', 'CE', 'ME', 'EE', 'MKT', 'ACCT', 'HRM', 'MIS', 'SCM']
    const bachelorsMajors = availableMajors.filter(m => bachelorsIds.includes(m.id))
    const diplomaMajors = availableMajors.filter(m => !bachelorsIds.includes(m.id))

    return (
        <div style={{ backgroundColor: '#FFF9E2', minHeight: '100vh', color: '#2C3531', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            <Navbar isLoggedIn={isLoggedIn} />

            {notificationMessage && (
                <div style={{
                    position: 'fixed',
                    top: '25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 3000,
                    background: '#2F5233',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    maxWidth: '90%',
                    textAlign: 'center',
                    border: '1px solid #DCA27B'
                }}>
                    <span>📢</span>
                    <span>{notificationMessage}</span>
                </div>
            )}

            {aiMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    background: '#2F5233',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    maxWidth: '88%',
                    textAlign: 'center',
                    lineHeight: '1.3'
                }}>
                    <span>💡</span>
                    <span>{aiMessage}</span>
                </div>
            )}

            {activeCell && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.4)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '15px'
                }}>
                    <div style={{
                        background: '#ffffff',
                        border: '2px solid #DCA27B',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '340px',
                        padding: '20px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold', color: '#2F5233', fontSize: '1rem' }}>
                                📌 إدارة الخانة ({activeCell.day} - {timeSlots[activeCell.timeIndex]})
                            </span>
                            <button
                                onClick={() => setActiveCell(null)}
                                style={{ background: 'none', border: 'none', color: '#b91c1c', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>
                            اختر المادة المناسبة لإضافتها أو استبدالها:
                        </div>

                        <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', paddingRight: '4px' }}>
                            {activeCoursesList.length === 0 ? (
                                <div style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center', padding: '15px' }}>لا توجد مواد مختارة في خطتك</div>
                            ) : (
                                activeCoursesList.map(c => (
                                    <button
                                        key={c.code}
                                        onClick={() => handleSelectCourseForCell(c.code)}
                                        style={{
                                            background: '#faf8f2',
                                            border: '1px solid #e6dec5',
                                            borderRadius: '8px',
                                            padding: '10px 12px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            textAlign: 'right',
                                            color: '#2F5233',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span>{c.code} - {c.title}</span>
                                        <span style={{ fontSize: '0.75rem', background: '#FEECD0', color: '#8c5521', padding: '2px 6px', borderRadius: '4px' }}>اختر</span>
                                    </button>
                                ))
                            )}
                        </div>

                        {activeCell.slotId && (
                            <button
                                onClick={() => handleRemoveSlot(activeCell.slotId!)}
                                style={{
                                    width: '100%',
                                    background: '#fee2e2',
                                    color: '#b91c1c',
                                    border: '1px solid #fca5a5',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                حذف المادة من هذا المربع 🗑️
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '1200px', margin: '40px auto 60px auto', padding: '0 20px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#2F5233', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        ← العودة للرئيسية
                    </Link>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {!isLoggedIn && (
                            <Link href="/login" style={{ background: '#2F5233', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                🔐 تسجيل الدخول لحفظ الجدول سحابياً
                            </Link>
                        )}

                        {saveStatus && (
                            <span style={{ background: '#FEECD0', color: '#8c5521', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                {saveStatus}
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '2px solid #DCA27B', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ fontSize: '1.2rem', color: '#2F5233', fontWeight: 'bold' }}>⏳ جاري تحميل بيانات الجدول والغيابات...</div>
                        </div>
                    ) : isAnalyzing ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ fontSize: '1.3rem', color: '#2F5233', fontWeight: 'bold', marginBottom: '10px' }}>🤖 جاري تحليل الجدول وترتيب المواد والأوقات بالذكاء الاصطناعي...</div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>يرجى الانتظار لحظات ريثما يتم ترتيب الجدول بدقة.</div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                <h3 style={{ fontSize: '1.4rem', color: '#2C3531', fontWeight: 'bold', margin: 0 }}>
                                    📅 جدولك الزمني وإدارة الغيابات
                                </h3>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {isConfigured && (
                                        <button
                                            onClick={() => {
                                                setIsEditingTimetable(!isEditingTimetable)
                                                if (isEditingTimetable) {
                                                    setActiveCell(null)
                                                    setPendingFile(null)
                                                    setPendingFilePreview(null)
                                                }
                                            }}
                                            style={{ background: isEditingTimetable ? '#2F5233' : '#DCA27B', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        >
                                            {isEditingTimetable ? '✔️ تأكيد وحفظ الجدول' : '🗓️ تعديل الجدول'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!selectedMajorId ? (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#2C3531', fontWeight: 'bold' }}>اختر تخصصك الأكاديمي للبدء:</h4>

                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#8c5521', marginBottom: '10px', background: '#FEECD0', display: 'inline-block', padding: '3px 12px', borderRadius: '6px' }}>
                                            🎓 برامج البكالوريوس
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            {bachelorsMajors.map(major => (
                                                <button
                                                    key={major.id}
                                                    onClick={() => setSelectedMajorId(major.id)}
                                                    style={{ background: '#2F5233', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    {major.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {diplomaMajors.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#8c5521', marginBottom: '10px', background: '#FEECD0', display: 'inline-block', padding: '3px 12px', borderRadius: '6px' }}>
                                                🛠️ برامج الدبلوم
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                {diplomaMajors.map(major => (
                                                    <button
                                                        key={major.id}
                                                        onClick={() => setSelectedMajorId(major.id)}
                                                        style={{ background: '#3D5A80', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                                                    >
                                                        {major.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : !isConfigured ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                                        <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#2C3531' }}>اختر مواد تخصصك:</h4>
                                        {selectedCourseCodes.length > 0 && (
                                            <button
                                                onClick={() => setIsConfigured(true)}
                                                style={{ background: 'none', border: 'none', color: '#2F5233', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                            >
                                                العودة للجدول ↩️
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '6px', marginBottom: '20px', border: '1px solid #eee', borderRadius: '12px', padding: '12px', background: '#faf8f2' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {currentMajorObj.semesters.map((sem) => {
                                                const semCodes = sem.courses.map(c => c.code)
                                                const isFullSemSelected = semCodes.every(code => selectedCourseCodes.includes(code))

                                                return (
                                                    <div key={sem.id} style={{ background: '#ffffff', border: '1px solid #e6dec5', borderRadius: '12px', padding: '14px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
                                                            <span style={{ fontWeight: 'bold', color: '#2F5233', fontSize: '1rem' }}>{sem.name}</span>
                                                            <button
                                                                onClick={() => toggleFullSemester(sem.courses)}
                                                                style={{
                                                                    background: isFullSemSelected ? '#2F5233' : '#FEECD0',
                                                                    color: isFullSemSelected ? '#fff' : '#8c5521',
                                                                    border: 'none',
                                                                    padding: '5px 10px',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 'bold',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {isFullSemSelected ? 'إلغاء تحديد الترم ❌' : 'تحديد الترم كامل ✅'}
                                                            </button>
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                                                            {sem.courses.map((course) => {
                                                                const isChecked = selectedCourseCodes.includes(course.code)
                                                                return (
                                                                    <div
                                                                        key={course.code}
                                                                        onClick={() => toggleCourseSelection(course.code)}
                                                                        style={{
                                                                            background: isChecked ? '#eef6f0' : '#fff',
                                                                            border: `1px solid ${isChecked ? '#2F5233' : '#ddd'}`,
                                                                            borderRadius: '8px',
                                                                            padding: '8px 10px',
                                                                            cursor: 'pointer',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                            transition: 'all 0.15s'
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2F5233' }}>{course.code}</div>
                                                                            <div style={{ fontSize: '0.85rem', color: '#2C3531' }}>{course.title}</div>
                                                                        </div>
                                                                        <span style={{ fontSize: '1rem' }}>{isChecked ? '☑️' : '◻️'}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        disabled={selectedCourseCodes.length === 0}
                                        onClick={handleSaveSelectedCourses}
                                        style={{
                                            width: '100%',
                                            background: selectedCourseCodes.length === 0 ? '#ccc' : '#DCA27B',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '14px',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            cursor: selectedCourseCodes.length === 0 ? 'not-allowed' : 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        حفظ الخطة وتحديث الجدول ({selectedCourseCodes.length} مواد مختارة) 🚀
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: isEditingTimetable ? '#fffbeb' : '#f9f6ed', border: `1px solid ${isEditingTimetable ? '#f59e0b' : '#e6dec5'}`, padding: '12px 16px', borderRadius: '10px', flexWrap: 'wrap', gap: '10px' }}>
                                        <span style={{ fontSize: '0.95rem', color: '#2C3531', fontWeight: 'bold' }}>
                                          {isEditingTimetable
                                              ? '🛠️ وضع تعديل الجدول مفعل: اسحب أو ارفع جدولك بالصورة أدناه، ثم اضغط على زر بدء التحليل.'
                                              : '✨ اضغط على أي مادة لتسجيل غيابها (تتحول للأحمر 🔴).'
                                          }
                                        </span>

                                        {isEditingTimetable && (
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={async () => {
                                                        const nextStatus = !showLateHours
                                                        setShowLateHours(nextStatus)
                                                        await saveDataToSupabase(selectedMajorId, selectedCourseCodes, courseAbsences, coursePlannedAbsences, absentSlots, weeklyTimetable, nextStatus)
                                                    }}
                                                    style={{ background: showLateHours ? '#2F5233' : '#FEECD0', color: showLateHours ? '#fff' : '#8c5521', border: '1px solid #DCA27B', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                                >
                                                    {showLateHours ? '➖ إخفاء الساعات' : '➕ إضافة ساعات (إلى 6:15)'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {isEditingTimetable && (
                                        <div style={{ marginBottom: '20px' }}>
                                            {!pendingFile ? (
                                                <div
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    style={{
                                                        border: '2px dashed #2F5233',
                                                        borderRadius: '14px',
                                                        padding: '24px',
                                                        textAlign: 'center',
                                                        background: '#fcfbfa',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s'
                                                    }}
                                                >
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={handleFileUpload}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#2F5233', marginBottom: '4px' }}>
                                                        اسحب وأفلت صورة جدولك هنا، أو اضغط للاختيار من جهازك / الكاميرا
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        (لن يتم التحليل مباشرة إلا بعد التأكيد ومراجعة الصورة)
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{
                                                    border: '2px solid #2F5233',
                                                    borderRadius: '14px',
                                                    padding: '16px',
                                                    background: '#faf8f2',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2F5233' }}>
                                                        📄 الملف المختار: {pendingFile.name}
                                                    </div>

                                                    {pendingFilePreview && pendingFile.type.startsWith('image/') && (
                                                        <img
                                                            src={pendingFilePreview}
                                                            alt="معاينة الجدول"
                                                            style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', border: '1px solid #ccc' }}
                                                        />
                                                    )}

                                                    <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={executeAnalysis}
                                                            style={{
                                                                background: '#2F5233',
                                                                color: '#fff',
                                                                border: 'none',
                                                                padding: '10px 20px',
                                                                borderRadius: '8px',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            🤖 بدء تحليل الجدول بالذكاء الاصطناعي
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setPendingFile(null)
                                                                setPendingFilePreview(null)
                                                            }}
                                                            style={{
                                                                background: '#fee2e2',
                                                                color: '#b91c1c',
                                                                border: '1px solid #fca5a5',
                                                                padding: '10px 16px',
                                                                borderRadius: '8px',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            ❌ تغيير الصورة
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <style dangerouslySetInnerHTML={{__html: `
                                        @media (max-width: 768px) {
                                            .desktop-table-container { display: none !important; }
                                            .mobile-cards-container { display: flex !important; }
                                        }
                                        @media (min-width: 769px) {
                                            .desktop-table-container { display: block !important; }
                                            .mobile-cards-container { display: none !important; }
                                        }
                                    `}} />

                                    {/* عرض الكمبيوتر */}
                                    <div className="desktop-table-container" style={{ overflowX: 'auto', marginBottom: '35px', border: '1px solid #e6dec5', borderRadius: '16px', background: '#faf8f2', padding: '14px', display: 'none' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'center', tableLayout: 'fixed', minWidth: '800px' }}>
                                            <thead>
                                            <tr style={{ color: '#2F5233', fontSize: '0.85rem' }}>
                                                <th style={{ padding: '8px', width: '90px' }}>اليوم</th>
                                                {timeSlots.map((time, idx) => (
                                                    <th key={idx} style={{ padding: '8px 2px', background: '#FEECD0', borderRadius: '8px', fontSize: '0.75rem', color: '#8c5521', border: '1px solid #f6d8b5', width: columnWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {time}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {daysOfWeek.map((day) => {
                                                return (
                                                    <tr key={day}>
                                                        <td style={{ padding: '4px', width: '90px' }}>
                                                            <div style={{ background: '#2F5233', color: '#fff', fontWeight: 'bold', padding: '10px 4px', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {day}
                                                            </div>
                                                        </td>

                                                        {timeSlots.map((_, timeIndex) => {
                                                            const slot = weeklyTimetable.find(s => s.day === day && s.timeSlotIndex === timeIndex)

                                                            return (
                                                                <td key={timeIndex} style={{ padding: '4px', width: columnWidth, height: '50px' }}>
                                                                    {!slot ? (
                                                                        <div
                                                                            onClick={() => {
                                                                                if (isEditingTimetable) {
                                                                                    setActiveCell({ day, timeIndex })
                                                                                }
                                                                            }}
                                                                            style={{
                                                                                background: isEditingTimetable ? '#fffdf4' : '#f5f2e8',
                                                                                borderRadius: '10px',
                                                                                height: '42px',
                                                                                width: '100%',
                                                                                border: isEditingTimetable ? '2px dashed #DCA27B' : '1px dashed #e2dcce',
                                                                                cursor: isEditingTimetable ? 'pointer' : 'default',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                fontSize: '0.7rem',
                                                                                color: '#999',
                                                                                overflow: 'hidden'
                                                                            }}
                                                                        >
                                                                            {isEditingTimetable ? '+' : ''}
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            onClick={() => toggleSlotAbsence(slot)}
                                                                            style={{
                                                                                background: !!absentSlots[slot.id] ? '#fee2e2' : '#ffffff',
                                                                                border: `2px solid ${!!absentSlots[slot.id] ? '#b91c1c' : '#2F5233'}`,
                                                                                borderRadius: '10px',
                                                                                padding: '4px 6px',
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.2s ease',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                                                                height: '42px',
                                                                                width: '100%',
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                overflow: 'hidden',
                                                                                boxSizing: 'border-box'
                                                                            }}
                                                                        >
                                                                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: !!absentSlots[slot.id] ? '#b91c1c' : '#2F5233', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                {slot.courseCode}
                                                                            </div>
                                                                            <div style={{ fontSize: '0.5rem', color: !!absentSlots[slot.id] ? '#991b1b' : '#666', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                {isEditingTimetable ? '✏️ تعديل' : (!!absentSlots[slot.id] ? '🔴 غائب' : slot.courseTitle)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            )
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* عرض الجوال (سحب أفقي لصفحات الأيام والمحاضرات مباشرة) */}
                                    <div className="mobile-cards-container" style={{ display: 'none', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>

                                        {/* حاوية السحب الأفقي لبطاقات الأيام والمحاضرات */}
                                        <div
                                            ref={mobileDaysContainerRef}
                                            onScroll={(e) => {
                                                const container = e.currentTarget
                                                const index = Math.round(container.scrollLeft / container.clientWidth)
                                                if (index >= 0 && index < daysOfWeek.length && index !== selectedMobileDayIndex) {
                                                    setSelectedMobileDayIndex(index)
                                                }
                                            }}
                                            style={{
                                                display: 'flex',
                                                overflowX: 'auto',
                                                scrollSnapType: 'x mandatory',
                                                scrollbarWidth: 'none',
                                                WebkitOverflowScrolling: 'touch',
                                                gap: '0px'
                                            }}
                                        >
                                            {daysOfWeek.map((day, dayIndex) => {
                                                const isToday = day === getTodayName()
                                                return (
                                                    <div
                                                        key={day}
                                                        style={{
                                                            minWidth: '100%',
                                                            boxSizing: 'border-box',
                                                            scrollSnapAlign: 'start',
                                                            padding: '0 4px'
                                                        }}
                                                    >
                                                        <div style={{ background: '#faf8f2', border: '1.5px solid #e6dec5', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>

                                                            {/* رأس بطاقة اليوم */}
                                                            <div style={{ background: '#FEECD0', color: '#8c5521', fontWeight: 'bold', padding: '10px 14px', borderRadius: '12px', fontSize: '0.95rem', marginBottom: '14px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span>📅 اليوم: <b>{day}</b> {isToday && '(اليوم الحالي)'}</span>
                                                                <span style={{ fontSize: '0.75rem', color: '#666' }}>(اسحب يمين/يسار ↔️)</span>
                                                            </div>

                                                            {/* قائمة المحاضرات التابعة لهذا اليوم */}
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {timeSlots.map((timeStr, timeIndex) => {
                                                                    const slot = weeklyTimetable.find(s => s.day === day && s.timeSlotIndex === timeIndex)

                                                                    if (!slot && !isEditingTimetable) return null

                                                                    const isAbsent = slot ? !!absentSlots[slot.id] : false

                                                                    return (
                                                                        <div
                                                                            key={`${day}-${timeIndex}`}
                                                                            onClick={() => {
                                                                                if (slot) {
                                                                                    toggleSlotAbsence(slot)
                                                                                } else if (isEditingTimetable) {
                                                                                    setActiveCell({ day, timeIndex })
                                                                                }
                                                                            }}
                                                                            style={{
                                                                                background: slot ? (isAbsent ? '#fee2e2' : '#ffffff') : '#fffdf4',
                                                                                border: `1.5px ${slot ? (isAbsent ? 'solid #b91c1c' : 'solid #2F5233') : 'dashed #DCA27B'}`,
                                                                                borderRadius: '12px',
                                                                                padding: '12px 14px',
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center',
                                                                                cursor: 'pointer',
                                                                                minHeight: '48px',
                                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <span style={{ fontSize: '0.75rem', background: '#FEECD0', color: '#8c5521', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', minWidth: '55px', textAlign: 'center' }}>
                                                                                    {timeStr}
                                                                                </span>
                                                                                <div>
                                                                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: slot ? (isAbsent ? '#b91c1c' : '#2F5233') : '#999' }}>
                                                                                        {slot ? slot.courseCode : '(فارغ - اضغط للإضافة)'}
                                                                                    </div>
                                                                                    {slot && (
                                                                                        <div style={{ fontSize: '0.75rem', color: isAbsent ? '#991b1b' : '#555' }}>
                                                                                            {slot.courseTitle}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', background: slot ? (isAbsent ? '#fee2e2' : '#eef6f0') : '#FEECD0', color: slot ? (isAbsent ? '#b91c1c' : '#2F5233') : '#8c5521', padding: '4px 10px', borderRadius: '6px' }}>
                                                                                    {slot ? (isEditingTimetable ? '✏️ تعديل' : (isAbsent ? '🔴 غائب' : '🟢 حاضر')) : '+ إضافة'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}

                                                                {timeSlots.every(
                                                                    (_, timeIndex) => !weeklyTimetable.find(s => s.day === day && s.timeSlotIndex === timeIndex)
                                                                ) && !isEditingTimetable && (
                                                                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#888', fontSize: '0.9rem' }}>
                                                                        🎉 لا توجد محاضرات مسجلة في يوم {day} (إجازة / OFF)
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* مؤشرات التنقل النقاطية (Dots Indicators) لتوضيح اليوم الحالي */}
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '5px' }}>
                                            {daysOfWeek.map((day, idx) => (
                                                <button
                                                    key={day}
                                                    onClick={() => {
                                                        setSelectedMobileDayIndex(idx)
                                                        if (mobileDaysContainerRef.current) {
                                                            mobileDaysContainerRef.current.scrollTo({
                                                                left: mobileDaysContainerRef.current.clientWidth * idx,
                                                                behavior: 'smooth'
                                                            })
                                                        }
                                                    }}
                                                    style={{
                                                        width: selectedMobileDayIndex === idx ? '24px' : '8px',
                                                        height: '8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: selectedMobileDayIndex === idx ? '#2F5233' : '#dcd6c0',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                    </div>

                                    <h4 style={{ fontSize: '1.1rem', color: '#2C3531', marginBottom: '15px' }}>📚 تفاصيل رصيد المواد النشطة وحدود الحرمان:</h4>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                                        {sortedActiveCourses.map((course) => {
                                            const currentAbsent = courseAbsences[course.code] || 0
                                            const plannedAbsent = coursePlannedAbsences[course.code] || 0
                                            const percentageActual = Math.min(100, (currentAbsent / course.maxAbsence) * 100)
                                            const percentagePlanned = Math.min(100 - percentageActual, (plannedAbsent / course.maxAbsence) * 100)
                                            const isDanger = (currentAbsent + plannedAbsent) >= course.maxAbsence * 0.75
                                            const isExpanded = expandedCourseCode === course.code

                                            return (
                                                <div
                                                    key={course.code}
                                                    onClick={() => toggleExpand(course.code)}
                                                    style={{
                                                        background: '#fcfbfa',
                                                        border: `1px solid ${isDanger ? '#fca5a5' : '#e6dec5'}`,
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                                        cursor: 'pointer',
                                                        gridColumn: isExpanded ? '1 / -1' : 'auto',
                                                        order: isExpanded ? -1 : 0
                                                    }}
                                                >
                                                    <div style={{ width: '100%', background: '#e5e7eb', height: '6px', display: 'flex' }}>
                                                        <div style={{ width: `${percentageActual}%`, height: '100%', backgroundColor: isDanger ? '#b91c1c' : '#2F5233', transition: 'width 0.3s ease' }} />
                                                        <div style={{ width: `${percentagePlanned}%`, height: '100%', backgroundColor: '#f59e0b', opacity: 0.8, transition: 'width 0.3s ease' }} />
                                                    </div>

                                                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <span style={{ fontSize: '0.75rem', background: '#FEECD0', color: '#8c5521', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{course.code}</span>
                                                            <h5 style={{ margin: '6px 0 0 0', fontSize: '0.95rem', color: '#2C3531', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{course.title}</h5>
                                                        </div>

                                                        <div style={{ textAlign: 'left' }}>
                                                            <div style={{ fontSize: '0.85rem', color: isDanger ? '#b91c1c' : '#555', fontWeight: 'bold' }}>
                                                                {currentAbsent} {plannedAbsent > 0 ? `(+${plannedAbsent} احتياطي)` : ''} / {course.maxAbsence} س
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: '#DCA27B' }}>{isExpanded ? '▲ إخفاء' : '▼ تعديل يدوي'}</span>
                                                        </div>
                                                    </div>

                                                    {isExpanded && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{ padding: '16px 20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}
                                                        >
                                                            <div style={{ fontSize: '0.85rem', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>الساعات المعتمدة: <b>{course.creditHours} س</b></span>
                                                                <span>حد الحرمان الأقصى (20%): <b>{course.maxAbsence} ساعات</b></span>
                                                            </div>

                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfbfa', padding: '8px 12px', borderRadius: '8px' }}>
                                                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2C3531' }}>الغياب الفعلي:</span>
                                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                                    <button
                                                                        onClick={() => updateAbsence(course.code, -1, course.maxAbsence, false)}
                                                                        style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span style={{ padding: '4px 8px', fontWeight: 'bold' }}>{currentAbsent}</span>
                                                                    <button
                                                                        onClick={() => updateAbsence(course.code, 1, course.maxAbsence, false)}
                                                                        style={{ background: '#2F5233', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb', padding: '8px 12px', borderRadius: '8px', border: '1px dashed #f59e0b' }}>
                                                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b45309' }}>🟡 الغياب الاحتياطي المخطط:</span>
                                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                                    <button
                                                                        onClick={() => updateAbsence(course.code, -1, course.maxAbsence, true)}
                                                                        style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span style={{ padding: '4px 8px', fontWeight: 'bold', color: '#b45309' }}>{plannedAbsent}</span>
                                                                    <button
                                                                        onClick={() => updateAbsence(course.code, 1, course.maxAbsence, true)}
                                                                        style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )}

                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div style={{ borderTop: '2px solid #e6dec5', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => setIsConfigured(false)}
                                            style={{ background: '#2F5233', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
                                        >
                                            تعديل المواد المختارة ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMajorId('')
                                                setIsConfigured(false)
                                            }}
                                            style={{ background: '#FEECD0', color: '#8c5521', border: '1px solid #DCA27B', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
                                        >
                                            تغيير التخصص الأكاديمي 🔄
                                        </button>
                                    </div>

                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}