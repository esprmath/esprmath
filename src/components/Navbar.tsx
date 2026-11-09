'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TOUR_EVENTS } from '@/components/OnboardingTour'
import { authErrorText, MIN_PASSWORD } from '@/lib/authErrors'

// حروف الخلفية بأحجام وارتفاعات وميلان مختلفة
const NAV_LETTERS = {
    E: { size: '1.7rem', y: -8, rotate: -14 },
    S: { size: '1.25rem', y: 6, rotate: 9 },
    P: { size: '0.9rem', y: -11, rotate: 18 },
    R: { size: '1.5rem', y: 10, rotate: -7 },
    M: { size: '1rem', y: -6, rotate: -18 },
    A: { size: '1.75rem', y: 9, rotate: 11 },
    T: { size: '1.1rem', y: -10, rotate: -4 },
    H: { size: '1.4rem', y: 4, rotate: 14 },
}

const letter = (ch: keyof typeof NAV_LETTERS) => {
    const l = NAV_LETTERS[ch]
    return <span style={{ fontSize: l.size, transform: `translateY(${l.y}px) rotate(${l.rotate}deg)` }}>{ch}</span>
}

// فراغ يتمدد حسب عرض الشاشة، والرقم وزنه من المساحة الفاضية
const gap = (w: number) => <i className="nav-gap" style={{ flexGrow: w }} />

// صفحات ألوانها الليلية جاهزة (الباقي يتعتم بالفلتر العام في globals.css)
const DARK_NATIVE_PAGES = ['/']

// شكل اللمبة: نهاية السلك (ex, ey)، نقطة انحناء السلك (cx, cy)، ميلان الرأس theta، وحجمه s
type LampShape = { s: number; ex: number; ey: number; theta: number; cx: number; cy: number }

interface NavbarProps {
    isLoggedIn: boolean;
    /** زر يظهر في الجوال فقط مكان زر موعد الاختبار، مثل زر «الاختبارات» في صفحة الكورس */
    mobileAction?: React.ReactNode;
}

export default function Navbar({ isLoggedIn, mobileAction }: NavbarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const isHomePage = pathname === '/'
    // «لكل مجتهد نصيب» داخل صفحات الدروس فقط (workspace/الكورس/الموديول وأعمق)
    const showMotto = /^\/workspace\/[^/]+\/[^/]+/.test(pathname ?? '')

    // ===== الوضع الليلي (لإلغائه: احذف هذا القسم وقسم اللمبة، وبلوك الوضع الليلي في globals.css، والسكربت في layout.tsx) =====
    // الاختيار محفوظ في المتصفح ويطبق على كل الصفحات.
    // الصفحات اللي ألوانها الليلية جاهزة (DARK_NATIVE_PAGES) تاخذ ألوانها الحقيقية، والباقي يتعتم بفلتر عام لين نجهزها
    const [isDark, setIsDark] = useState(false)
    useEffect(() => {
        let saved: string | null = null
        try { saved = localStorage.getItem('theme') } catch {}
        setIsDark(saved === 'dark')
    }, [])
    useEffect(() => {
        const root = document.documentElement
        if (isDark) root.setAttribute('data-theme', 'dark')
        else root.removeAttribute('data-theme')
        if (DARK_NATIVE_PAGES.includes(pathname ?? '')) root.setAttribute('data-dark-native', '')
        else root.removeAttribute('data-dark-native')
    }, [isDark, pathname])
    // مكان اللمبة يُقاس من حرف I في YIC حتى يبدأ السلك منه بالضبط في كل مقاس
    const navLogoRef = useRef<HTMLDivElement>(null)
    const yicIRef = useRef<HTMLSpanElement>(null)
    const [lampPos, setLampPos] = useState<{ left: number; top: number; shape: LampShape } | null>(null)
    useEffect(() => {
        const lampRef = { current: null as HTMLElement | null }
        const measure = () => {
            const logo = navLogoRef.current
            const iEl = yicIRef.current
            if (!logo || !iEl) return
            const l = logo.getBoundingClientRect()
            const r = iEl.getBoundingClientRect()
            const cs = getComputedStyle(iEl)
            const spacing = parseFloat(cs.letterSpacing) || 0
            // بداية السلك عند رأس الحروف بالضبط: ارتفاع الخط ناقص ارتفاع حرف I من مقاييس الخط نفسه
            let capOffset = r.height * 0.22
            const ctx = document.createElement('canvas').getContext('2d')
            if (ctx) {
                ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
                const m = ctx.measureText('I')
                if (m.fontBoundingBoxAscent) capOffset = m.fontBoundingBoxAscent - m.actualBoundingBoxAscent
            }
            // رفعة بسيطة حتى يبان رأس السلك على نفس مستوى رؤوس Y و C بالعين
            const lift = parseFloat(cs.fontSize) * 0.2
            const left = r.left - l.left + (r.width - spacing) / 2
            const top = r.top - l.top + capOffset - lift

            // إذا تحت اللمبة زر أو رابط، تميل وتسند عليه وهي معلقة بالسلك (لليمين، ولليسار إذا ما فيه مكان)
            lampRef.current = lampRef.current ?? logo.querySelector<HTMLElement>('.nav-lamp')
            const lamp = lampRef.current
            const H = lamp?.offsetHeight || 70
            const W = lamp?.offsetWidth || 24
            const pivotX = l.left + left
            const pivotY = l.top + top
            let obstacle: DOMRect | null = null
            document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, select').forEach((el) => {
                if (el.closest('nav')) return
                const b = el.getBoundingClientRect()
                if (b.width === 0 || b.height === 0) return
                const overlapsX = b.left < pivotX + W / 2 && b.right > pivotX - W / 2
                if (overlapsX && b.top > pivotY && b.top < pivotY + H && (!obstacle || b.top < obstacle.top)) obstacle = b
            })

            // الرسم بالبكسل وأصله رأس السلك. s = حجم الرأس بالنسبة لتصميمه الأصلي (عرض 30)
            const s = W / 30
            const R = 11.5 * s // نص قطر الزجاجة
            let shape: LampShape = { s, ex: 0, ey: 30 * s, theta: 0, cx: 0, cy: 15 * s }
            const btn = obstacle as DOMRect | null
            if (btn) {
                // الأفضل: السلك يمتد لليمين واللمبة تسند على زاوية الزر اليمنى من برا، فما تغطي الزر
                const theta = -28
                const rad = (theta * Math.PI) / 180
                const axis = { x: -Math.sin(rad), y: Math.cos(rad) } // اتجاه الرأس من نهاية السلك لتحت
                const cornerX = btn.right - pivotX
                const cornerY = btn.top - pivotY
                const gx = cornerX + R * 0.8 // مركز الزجاجة: ملاصق لحافة الزر من اليمين
                const gy = cornerY + R * 0.35
                const ex = gx - axis.x * 30 * s
                const ey = gy - axis.y * 30 * s
                const fitsRight = pivotX + gx + R + 1 <= window.innerWidth
                if (fitsRight && ey > 6 * s) {
                    // السلك ينزل أول مستقيم (ما يلمس حرف C) ثم ينحني لليمين من ثقل اللمبة
                    shape = { s, ex, ey, theta, cx: ex * 0.08, cy: ey * 0.85 }
                } else {
                    // ما فيه مكان يمين الزر: السلك نازل والرأس يميل ويسند على سطح الزر
                    const cordEnd = 30 * s
                    const headLen = 46 * s
                    const ratio = Math.min(Math.max((cornerY - cordEnd - 2) / headLen, 0), 1)
                    const angle = (Math.acos(ratio) * 180) / Math.PI
                    const reach = Math.sin((angle * Math.PI) / 180) * headLen + W / 2
                    shape = { s, ex: 0, ey: cordEnd, theta: pivotX + reach < window.innerWidth - 4 ? -angle : angle, cx: 0, cy: cordEnd / 2 }
                }
            }
            setLampPos({ left, top, shape })
        }
        measure()
        document.fonts?.ready.then(measure)
        // المحتوى أحياناً يتأخر بالتحميل، فنعيد القياس بعد شوي
        const t1 = window.setTimeout(measure, 400)
        const t2 = window.setTimeout(measure, 1500)
        window.addEventListener('resize', measure)
        return () => {
            window.removeEventListener('resize', measure)
            window.clearTimeout(t1)
            window.clearTimeout(t2)
        }
    }, [pathname])
    // عرض أزرار اليسار (يتغير حسب تسجيل الدخول وموعد الاختبار) حتى تبدأ «نصيب» بعدها
    const navRef = useRef<HTMLElement>(null)
    const leftGroupRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const nav = navRef.current
        const group = leftGroupRef.current
        if (!nav || !group) return
        const update = () => {
            const w = group.getBoundingClientRect().right - nav.getBoundingClientRect().left
            nav.style.setProperty('--nav-left-w', `${Math.round(w)}px`)
        }
        update()
        const ro = new ResizeObserver(update)
        ro.observe(group)
        ro.observe(nav)
        return () => ro.disconnect()
    }, [])
    const toggleTheme = () => {
        setIsDark((d) => {
            const next = !d
            try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
            return next
        })
    }

    // ===== سحب اللمبة (الشاشات الكبيرة فقط) =====
    // g = مكان مركز الزجاجة بالنسبة لرأس السلك. taut: السلك مشدود والرأس باتجاهه، hang: معلقة عمودية
    const [drag, setDrag] = useState<{ gx: number; gy: number; mode: 'taut' | 'hang' } | null>(null)
    const dragRef = useRef<{ startX: number; startY: number; px: number; py: number; moved: boolean } | null>(null)
    const suppressClickRef = useRef(false)
    const fallRaf = useRef<number | null>(null)
    useEffect(() => {
        setDrag(null)
        return () => { if (fallRaf.current) cancelAnimationFrame(fallRaf.current) }
    }, [pathname])
    const isBigScreen = () => window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
    const lampPivot = () => {
        const logo = navLogoRef.current
        if (!logo || !lampPos) return null
        const l = logo.getBoundingClientRect()
        return { x: l.left + lampPos.left, y: l.top + lampPos.top }
    }
    const onLampPointerDown = (e: React.PointerEvent<SVGGElement>) => {
        if (!isBigScreen() || !lampPos) return
        const p = lampPivot()
        if (!p) return
        if (fallRaf.current) cancelAnimationFrame(fallRaf.current)
        e.currentTarget.setPointerCapture(e.pointerId)
        dragRef.current = { startX: e.clientX, startY: e.clientY, px: p.x, py: p.y, moved: false }
    }
    const onLampPointerMove = (e: React.PointerEvent<SVGGElement>) => {
        const d = dragRef.current
        if (!d) return
        if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 5) return
        d.moved = true
        setDrag({ gx: e.clientX - d.px, gy: e.clientY - d.py, mode: 'taut' })
    }
    const onLampPointerUp = (e: React.PointerEvent<SVGGElement>) => {
        const d = dragRef.current
        dragRef.current = null
        if (!d || !d.moved || !lampPos) return
        suppressClickRef.current = true // الضغطة اللي تجي بعد السحب ما تشغل الوضع الليلي
        releaseLamp(e.clientX - d.px, e.clientY - d.py, d.px, d.py)
    }
    // بعد الإفلات: السلك يرجع لطوله الأصلي إذا كان ممدود، ثم تنزل بالجاذبية لين تسند على شي أو ينشد السلك
    const releaseLamp = (gx0: number, gy0: number, px: number, py: number) => {
        const s = lampPos!.shape.s
        const head = 30 * s // من نهاية السلك لمركز الزجاجة
        const L0 = 30 * s // طول السلك الأصلي
        const R = 11.5 * s
        const obstacles: DOMRect[] = []
        document.querySelectorAll<HTMLElement>(
            'button, a, input, select, textarea, img, video, iframe, [class*="card" i], [class*="panel" i], .idea-step, .pager-btn'
        ).forEach((el) => {
            if (el.closest('.nav-lamp')) return
            const r = el.getBoundingClientRect()
            if (r.width > 0 && r.height > 0) obstacles.push(r)
        })
        let gx = gx0
        let gy = gy0
        let vy = 0
        let phase: 'retract' | 'fall' = 'retract'
        const step = () => {
            if (phase === 'retract') {
                const dist = Math.hypot(gx, gy)
                const maxDist = L0 + head
                if (dist <= maxDist + 0.5) {
                    phase = 'fall'
                } else {
                    const next = Math.max(maxDist, dist - Math.max(6, (dist - maxDist) * 0.25))
                    gx *= next / dist
                    gy *= next / dist
                    setDrag({ gx, gy, mode: 'taut' })
                    fallRaf.current = requestAnimationFrame(step)
                    return
                }
            }
            // نزول عمودي: نهاية السلك فوق مركز الزجاجة بمسافة head
            vy = Math.min(vy + 0.9, 18)
            let ny = gy + vy
            let done = false
            let mode: 'taut' | 'hang' = 'hang'
            // السلك ما يطول أكثر من L0
            const ex = gx
            if (Math.abs(ex) >= L0) {
                done = true
                mode = 'taut'
                ny = gy
            } else {
                const maxEy = Math.sqrt(L0 * L0 - ex * ex)
                if (ny - head >= maxEy) {
                    ny = maxEy + head
                    done = true
                    mode = Math.abs(ex) > 2 ? 'taut' : 'hang'
                }
            }
            // تسند على أي شي تحتها
            const bottomBefore = py + gy + R
            const bottomAfter = py + ny + R
            const x = px + gx
            for (const r of obstacles) {
                if (x + R * 0.6 < r.left || x - R * 0.6 > r.right) continue
                if (r.top >= bottomBefore - 1 && r.top <= bottomAfter) {
                    ny = r.top - py - R
                    done = true
                    mode = 'hang'
                }
            }
            gy = ny
            if (mode === 'taut') {
                // ينشد السلك: الرأس باتجاه السلك على طوله الأصلي
                const ang = Math.atan2(gx, gy)
                const len = L0 + head
                gx = Math.sin(ang) * len
                gy = Math.cos(ang) * len
            }
            setDrag({ gx, gy, mode })
            if (!done) fallRaf.current = requestAnimationFrame(step)
        }
        fallRaf.current = requestAnimationFrame(step)
    }
    const onLampClick = () => {
        if (suppressClickRef.current) {
            suppressClickRef.current = false
            return
        }
        toggleTheme()
    }
    // شكل اللمبة وقت السحب أو بعده
    const dragShape = (s: number): LampShape | null => {
        if (!drag) return null
        const { gx, gy, mode } = drag
        const head = 30 * s
        const L0 = 30 * s
        if (mode === 'taut') {
            const len = Math.hypot(gx, gy) || 1
            const ax = gx / len
            const ay = gy / len
            const ex = gx - ax * head
            const ey = gy - ay * head
            return { s, ex, ey, theta: (Math.atan2(-ax, ay) * 180) / Math.PI, cx: ex / 2, cy: ey / 2 }
        }
        // معلقة: الرأس عمودي، والسلك مرتخي بانحناءة حسب الطول الزايد
        const ex = gx
        const ey = gy - head
        const slack = Math.sqrt(Math.max(0, L0 * L0 - (ex * ex + ey * ey)))
        return { s, ex, ey, theta: 0, cx: ex / 2, cy: ey / 2 + slack * 0.6 }
    }

    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)
    const [courseApprovalStatus, setCourseApprovalStatus] = useState<boolean>(false)
    const [approvedCourseId, setApprovedCourseId] = useState<string | null>(null)
    const [showMenu, setShowMenu] = useState(false)
    const [showAuthDropdown, setShowAuthDropdown] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)
    const [newFullName, setNewFullName] = useState('')
    const [newStudentId, setNewStudentId] = useState('')
    const [loadingName, setLoadingName] = useState(false)

    // حالات مودال تغيير كلمة المرور المستقل
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [loadingPassword, setLoadingPassword] = useState(false)

    const [showCalendarModal, setShowCalendarModal] = useState(false)
    const [examDate, setExamDate] = useState<string | null>(null)
    const [loadingExamDate, setLoadingExamDate] = useState(false)

    const [isExamPromptMinimized, setIsExamPromptMinimized] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('exam_prompt_minimized') === 'true'
        }
        return false
    })

    const handleToggleMinimize = (minimized: boolean) => {
        setIsExamPromptMinimized(minimized)
        if (typeof window !== 'undefined') {
            localStorage.setItem('exam_prompt_minimized', String(minimized))
        }
    }

    const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const menuRef = useRef<HTMLDivElement>(null)
    const authDropdownRef = useRef<HTMLDivElement>(null)

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const fullName = user.user_metadata?.full_name
            setUserName(fullName || 'طالبنا العزيز')
            setUserEmail(user.email || '')
            setNewFullName(fullName || '')

            const { data: coursesData, error: coursesError } = await supabase
                .from('user_courses')
                .select('course_id, exam_date, is_approved, username')
                .eq('user_id', user.id)

            if (!coursesError && coursesData && coursesData.length > 0) {
                const activeCourse = coursesData.find(c => c.is_approved) || coursesData[0]
                if (activeCourse.is_approved) {
                    setCourseApprovalStatus(true)
                    setApprovedCourseId(activeCourse.course_id)
                }
                if (activeCourse.exam_date) {
                    setExamDate(activeCourse.exam_date)
                }
                if (activeCourse.username) {
                    setStudentId(activeCourse.username)
                    setNewStudentId(activeCourse.username)
                }
            }
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserData()
        }
    }, [isLoggedIn])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
            if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
                setShowAuthDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            setShowMenu(false)
            window.location.href = '/'
        } catch (err) {
            console.error('خطأ في تسجيل الخروج:', err)
        }
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newFullName.trim()) return

        // اسم المستخدم اختياري: الفارغ يعني بدون اسم مستخدم
        const cleanStudentId = newStudentId.trim().replace(/^@/, '').toLowerCase()
        if (cleanStudentId && !/^[a-z0-9_]{3,30}$/.test(cleanStudentId)) {
            setAlertMessage('اسم المستخدم من 3 إلى 30 خانة: حروف إنجليزية أو أرقام أو _ فقط.')
            setShowAlertModal(true)
            return
        }

        setLoadingName(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            if (cleanStudentId !== (studentId ?? '')) {
                if (cleanStudentId) {
                    // الفحص من قاعدة البيانات لأن الطالب لا يرى سجلات غيره
                    const { data: available, error: checkError } = await supabase.rpc('username_available', { p_username: cleanStudentId })
                    if (!checkError && available === false) {
                        setAlertMessage('❌ اسم المستخدم هذا مأخوذ، اختر اسمًا ثانيًا.')
                        setShowAlertModal(true)
                        return
                    }
                }

                const { data: updated, error: usernameError } = await supabase
                    .from('user_courses')
                    .update({ username: cleanStudentId || null })
                    .eq('user_id', user.id)
                    .select('id')

                if (usernameError) {
                    setAlertMessage(usernameError.message.includes('USERNAME_TAKEN')
                        ? '❌ اسم المستخدم هذا مأخوذ، اختر اسمًا ثانيًا.'
                        : 'تعذر حفظ اسم المستخدم، جرب مرة ثانية.')
                    setShowAlertModal(true)
                    return
                }
                if (!updated || updated.length === 0) {
                    setAlertMessage('اسم المستخدم يُحفظ بعد ما تسجل في كورس. سجّل في كورس من الصفحة الرئيسية ثم جرّب.')
                    setShowAlertModal(true)
                    return
                }
            }

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: newFullName.trim()
                }
            })

            if (error) {
                setAlertMessage('فشل تحديث البيانات، جرب مرة أخرى.')
                setShowAlertModal(true)
            } else {
                setUserName(newFullName.trim())
                setStudentId(cleanStudentId || null)
                setShowEditModal(false)
                setShowMenu(false)
                setAlertMessage('✅ تم تحديث الملف الشخصي بنجاح!')
                setShowAlertModal(true)
            }
        } catch (err) {
            console.error('خطأ أثناء تحديث البيانات:', err)
        } finally {
            setLoadingName(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmNewPassword) {
            setAlertMessage('❌ كلمة المرور الجديدة وتأكيدها غير متطابقتين.')
            setShowAlertModal(true)
            return
        }

        if (newPassword.length < MIN_PASSWORD) {
            setAlertMessage(`⚠️ كلمة المرور الجديدة يجب ألا تقل عن ${MIN_PASSWORD} أحرف أو أرقام.`)
            setShowAlertModal(true)
            return
        }

        setLoadingPassword(true)
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail || '',
                password: oldPassword
            })

            if (signInError) {
                setAlertMessage(signInError.code === 'invalid_credentials'
                    ? '❌ كلمة المرور الحالية غير صحيحة. يرجى التأكد وإعادة المحاولة.'
                    : `❌ ${authErrorText(signInError)}`)
                setShowAlertModal(true)
                setLoadingPassword(false)
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                setAlertMessage(`❌ ${authErrorText(updateError)}`)
                setShowAlertModal(true)
            } else {
                setAlertMessage('✅ تم تغيير كلمة المرور بنجاح!')
                setShowAlertModal(true)
                setShowPasswordModal(false)
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            }
        } catch (err) {
            console.error('خطأ أثناء تغيير كلمة المرور:', err)
            setAlertMessage('❌ حدث خطأ غير متوقع.')
            setShowAlertModal(true)
        } finally {
            setLoadingPassword(false)
        }
    }

    const saveSelectedDateToSupabase = async (dateStr: string) => {
        setLoadingExamDate(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setAlertMessage('⚠️ يجب تسجيل الدخول أولاً.')
                setShowAlertModal(true)
                return
            }

            if (!approvedCourseId) {
                setAlertMessage('⚠️ لا يوجد كورس مفعل لحفظ موعد الاختبار عليه.')
                setShowAlertModal(true)
                return
            }

            const { error } = await supabase
                .from('user_courses')
                .update({ exam_date: dateStr })
                .eq('user_id', user.id)
                .eq('course_id', approvedCourseId)

            if (error) {
                setAlertMessage(`❌ حدث خطأ أثناء حفظ تاريخ الاختبار: ${error.message}`)
                setShowAlertModal(true)
            } else {
                setExamDate(dateStr)
                setShowCalendarModal(false)
                window.dispatchEvent(new Event(TOUR_EVENTS.examDateSaved)) // تنقل جولة أول دخول للخطوة التالية
                setAlertMessage('✅ تم حفظ موعد اختبارك بنجاح!')
                setShowAlertModal(true)
            }
        } catch (err) {
            console.error('خطأ في حفظ تاريخ الاختبار:', err)
            setAlertMessage('❌ حدث خطأ غير متوقع.')
            setShowAlertModal(true)
        } finally {
            setLoadingExamDate(false)
        }
    }

    const getDaysRemaining = () => {
        if (!examDate) return null
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const exam = new Date(examDate)
        exam.setHours(0, 0, 0, 0)
        const diffTime = exam.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const daysLeft = getDaysRemaining()
    const isUrgent = daysLeft !== null && (daysLeft === 1 || daysLeft === 2)
    const hasUpcomingExam = daysLeft !== null && daysLeft >= 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const targetMonthDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1)
    const year = targetMonthDate.getFullYear()
    const month = targetMonthDate.getMonth()

    const monthNames = [
        'يناير (January)', 'فبراير (February)', 'مارس (March)', 'أبريل (April)',
        'مايو (May)', 'يونيو (June)', 'يوليو (July)', 'أغسطس (August)',
        'سبتمبر (September)', 'أكتوبر (October)', 'نوفمبر (November)', 'ديسمبر (December)'
    ]

    const firstDayIndex = targetMonthDate.getDay()
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

    const calendarDays = []
    for (let i = 0; i < firstDayIndex; i++) {
        calendarDays.push(null)
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
        const formattedMonth = String(month + 1).padStart(2, '0')
        const formattedDay = String(d).padStart(2, '0')
        calendarDays.push(`${year}-${formattedMonth}-${formattedDay}`)
    }

    return (
        <>
            <style jsx>{`
                .nav-container {
                    --btn-height: 36px;
                    --btn-font-size: 0.85rem;
                    --btn-padding-x: 0.75rem;
                    
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                    padding: 0.7rem 1.5rem;
                    /* بدون خلفية ولا خط: النافبار جزء من الصفحة، والشريط البني تحت الأزرار فقط */
                    background: transparent;
                    margin-bottom: 1rem;
                    position: relative;
                    z-index: 1000;
                    font-family: sans-serif;
                    box-sizing: border-box;
                }
                /* الشريط البني من اليسار، وينتهي بطرف دائري قبل الشعار فيبقى مكانه فاضي بلون الصفحة */
                .nav-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 175px;
                    background: var(--nav-bar, #8B5E3C);
                    /* طرف منحني: يبدأ من فوق عند الشعار وينزل مايل لين يلتف لتحت */
                    border-radius: 0 0 90px 0 / 0 0 100% 0;
                    z-index: 0;
                }
                /* حروف ESPRMATH مبعثرة فوق الشريط البني، بنفس حدوده وأغمق منه بشوي */
                /* على الشاشات الكبيرة تمتد على الشريط كله من أقصى اليسار لين قبل المنحنى، والأزرار فوقها */
                /* الطبقة توقف قبل منحنى الشريط، وكل حرف وكلمة مكانه بنسبة من عرضها */
                .nav-letters {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 240px;
                    z-index: 0;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    pointer-events: none;
                    user-select: none;
                }
                .nav-gap {
                    flex-basis: 0;
                }
                /* نصيب تبدأ بعد أزرار اليسار مهما كان عرضها (العرض يُقاس في الكود) */
                .gap-before-naseeb {
                    min-width: calc(var(--nav-left-w, 130px) - 25px);
                }
                .nav-letters :global(span) {
                    flex-shrink: 0;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-style: italic;
                    font-weight: 700;
                    line-height: 1;
                    color: var(--nav-ink, #74492B);
                }
                /* كلمات العبارة تكبر وتصغر مع الشاشة */
                .nav-word {
                    flex-shrink: 0;
                    height: clamp(28px, 3.2vw, 50px);
                    width: auto;
                    fill: var(--nav-ink, #74492B);
                }
                .word-lkl {
                    transform: translateY(-3px) rotate(-7deg);
                }
                .word-mjtahid {
                    transform: translateY(3px) rotate(4deg);
                }
                .word-naseeb {
                    transform: rotate(-5deg);
                }
                /* الإطار بلون الشريط ينحف حروف الرقعة بدون ما يصغرها */
                .nav-word text {
                    font-family: 'Aref Ruqaa', serif;
                    stroke: var(--nav-bar, #8B5E3C);
                    stroke-width: 0.8px;
                }
                .nav-logo,
                .nav-left-group {
                    position: relative;
                    z-index: 1;
                }
                .nav-logo {
                    flex-shrink: 0;
                }
                /* اللمبة نازلة بسلك يبدأ مكان حرف I في YIC (المكان يُحسب في الكود) */
                .nav-lamp {
                    position: absolute;
                    transform: translateX(-50%);
                    width: 24px;
                    height: 70px;
                    padding: 0;
                    border: none;
                    background: none;
                    -webkit-tap-highlight-color: transparent;
                    /* مربع الزر ما ينضغط حتى ما يغطي الأزرار اللي تحته، والضغط على اللمبة نفسها بس */
                    pointer-events: none;
                }
                .nav-lamp:focus-visible {
                    outline: 2px solid #DCA27B;
                    outline-offset: 2px;
                    border-radius: 6px;
                }
                .lamp-svg {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    overflow: visible;
                }
                .lamp-head {
                    pointer-events: visiblePainted;
                    cursor: pointer;
                }
                /* الشاشات الكبيرة: اللمبة تنسحب */
                @media (min-width: 1024px) and (pointer: fine) {
                    .lamp-head {
                        cursor: grab;
                        touch-action: none;
                    }
                    .lamp-head:active {
                        cursor: grabbing;
                    }
                }
                /* بنفس لون حرف I وعرضه تقريباً */
                .lamp-cord {
                    stroke: #8B5E3C;
                    fill: none;
                    stroke-linecap: round;
                }
                .lamp-twist {
                    stroke: #b88a5f;
                    fill: none;
                }
                .lamp-thread {
                    stroke: #4f3a1a;
                    stroke-width: 0.8;
                    opacity: 0.7;
                }
                .lamp-glass {
                    fill: url(#lampGlassOff);
                    stroke: rgba(110, 90, 70, 0.55);
                    stroke-width: 0.8;
                    transition: filter 0.3s;
                }
                .lamp-wires {
                    stroke: #8f8478;
                    stroke-width: 0.5;
                    fill: none;
                }
                .lamp-filament {
                    stroke: #7d6a55;
                    stroke-width: 0.7;
                    fill: none;
                    stroke-linejoin: round;
                }
                .lamp-shine {
                    fill: #ffffff;
                    opacity: 0.65;
                }
                .nav-lamp.is-on .lamp-glass {
                    fill: url(#lampGlassOn);
                    stroke: rgba(240, 170, 70, 0.8);
                    filter: drop-shadow(0 0 5px rgba(255, 210, 100, 0.95)) drop-shadow(0 0 18px rgba(255, 185, 70, 0.6)) drop-shadow(0 0 34px rgba(255, 170, 60, 0.35));
                }
                .nav-lamp.is-on .lamp-filament {
                    stroke: #fff6d0;
                    stroke-width: 0.9;
                }
                .nav-lamp.is-on .lamp-shine {
                    opacity: 0.35;
                }
                @media (max-width: 768px) {
                    .nav-lamp {
                        width: 19px;
                        height: 56px;
                    }
                }
                .nav-logo :global(.logo) {
                    display: inline-flex;
                    align-items: flex-start;
                    text-decoration: none;
                    line-height: 1;
                }
                /* الخط يُحدد على كل كلمة لأن globals.css يفرض Tajawal على كل العناصر */
                .logo-espr,
                .logo-math {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-style: italic;
                    font-weight: 700;
                }
                .logo-espr {
                    font-size: 1.2rem;
                    color: var(--home-espr, #8B5E3C);
                    margin-right: -3px;
                }
                .logo-bottom {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 8px;
                }
                .logo-math {
                    font-size: 1.75rem;
                    color: var(--home-text, #2C3531);
                }
                .logo-yic {
                    margin-top: -1px;
                    font-family: 'Tajawal', sans-serif;
                    font-weight: 700;
                    font-size: 0.65rem;
                    letter-spacing: 2.5px;
                    color: #8B5E3C;
                }
                .nav-left-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }
                .exam-date-slot {
                    display: contents;
                }
                .mobile-action {
                    display: none;
                }
                /* الجوال فقط (الآيباد واللابتوب يبقى فيهم موعد الاختبار) */
                @media (max-width: 767px) {
                    .exam-date-slot {
                        display: none;
                    }
                    .mobile-action {
                        display: flex;
                    }
                    /* الجوال فقط: العبارة تختفي والحروف تتوزع بالتساوي على الشريط */
                    .nav-word {
                        display: none;
                    }
                    .gap-before-naseeb {
                        min-width: 0;
                    }
                }

                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0.5rem 0.75rem;
                        margin-bottom: 0.6rem;
                        --btn-height: 32px;
                        --btn-font-size: 0.75rem;
                        --btn-padding-x: 0.5rem;
                    }
                    .nav-container::before {
                        right: 130px;
                    }
                    /* الجوال: نفس الامتداد على الشريط كله، والزر فوقها */
                    .nav-letters {
                        right: 176px;
                    }
                    .nav-letters :global(span) {
                        scale: 0.75;
                    }
                    .logo-espr {
                        font-size: 0.9rem;
                    }
                    .logo-bottom {
                        margin-top: 6px;
                    }
                    .logo-math {
                        font-size: 1.35rem;
                    }
                    .logo-yic {
                        font-size: 0.55rem;
                    }
                    .nav-left-group {
                        gap: 8px;
                    }
                }
            `}</style>

            <nav className="nav-container" ref={navRef}>
                {/* 1. الشعار أقصى اليمين */}
                <div className="nav-logo" ref={navLogoRef}>
                    {/* Espr صغيرة ومرفوعة مثل الأس، وMath أكبر وتحتها YIC */}
                    <Link href="/" dir="ltr" aria-label="EsprMath" className="logo">
                        <span className="logo-espr">Espr</span>
                        <span className="logo-bottom">
                            <span className="logo-math">Math</span>
                            {/* في الرئيسية حرف I يختفي ويبقى مكانه، ويبدأ منه سلك اللمبة */}
                            <span className="logo-yic">
                                Y<span ref={yicIRef} style={{ color: 'transparent' }}>I</span>C
                            </span>
                        </span>
                    </Link>
                    {/* الوضع الليلي: لمبة معلقة بسلك من YIC، تشغيلها يحول الموقع لليلي */}
                    {(() => { const base = lampPos?.shape ?? { s: 0.8, ex: 0, ey: 24, theta: 0, cx: 0, cy: 12 }; const lamp = dragShape(base.s) ?? base; return (
                        <button
                            type="button"
                            className={`nav-lamp${isDark ? ' is-on' : ''}`}
                            style={lampPos ? { left: lampPos.left, top: lampPos.top } : { visibility: 'hidden' }}
                            onClick={onLampClick}
                            aria-label={isDark ? 'الثيم النهاري' : 'الثيم الليلي'}
                            aria-pressed={isDark}
                        >
                            {/* الرسم بالبكسل وأصله رأس السلك، والزر نفسه ما يستقبل الضغط: اللمبة بس هي اللي تنضغط */}
                            <svg className="lamp-svg" width="1" height="1" aria-hidden="true">
                                <defs>
                                    <linearGradient id="lampBrass" x1="0" x2="1">
                                        <stop offset="0" stopColor="#5e4520" />
                                        <stop offset="0.35" stopColor="#e2bd68" />
                                        <stop offset="0.6" stopColor="#b48a3c" />
                                        <stop offset="1" stopColor="#4f3a1a" />
                                    </linearGradient>
                                    <radialGradient id="lampGlassOff" cx="0.42" cy="0.45" r="0.65">
                                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
                                        <stop offset="0.7" stopColor="#e9e3d8" stopOpacity="0.45" />
                                        <stop offset="1" stopColor="#bfb4a3" stopOpacity="0.6" />
                                    </radialGradient>
                                    <radialGradient id="lampGlassOn" cx="0.5" cy="0.5" r="0.6">
                                        <stop offset="0" stopColor="#fffdf0" />
                                        <stop offset="0.45" stopColor="#ffe08a" />
                                        <stop offset="1" stopColor="#f0a43a" stopOpacity="0.9" />
                                    </radialGradient>
                                </defs>
                                {/* السلك يبدأ مكان حرف I في YIC وبنفس لونه وعرضه تقريباً، والخطوط المتقطعة فوقه تعطي شكل الفتلة.
                                    عادي ينزل مستقيم، وإذا فيه زر تحته يمتد لليمين بانحناءة خفيفة */}
                                <path className="lamp-cord" d={`M0 0Q${lamp.cx} ${lamp.cy} ${lamp.ex} ${lamp.ey}`} style={{ strokeWidth: 2.6 * lamp.s }} />
                                <path className="lamp-twist" d={`M0 0Q${lamp.cx} ${lamp.cy} ${lamp.ex} ${lamp.ey}`} style={{ strokeWidth: 1.6 * lamp.s, strokeDasharray: `${1.3 * lamp.s} ${2.4 * lamp.s}` }} />
                                {/* رأس اللمبة (القاعدة والزجاجة): يتعلق بنهاية السلك ويميل باتجاهه */}
                                <g
                                    className="lamp-head"
                                    onPointerDown={onLampPointerDown}
                                    onPointerMove={onLampPointerMove}
                                    onPointerUp={onLampPointerUp}
                                    onPointerCancel={() => { dragRef.current = null }}
                                    transform={`translate(${lamp.ex} ${lamp.ey}) rotate(${lamp.theta}) scale(${lamp.s}) translate(-15 -30)`}>
                                    {/* قاعدة نحاسية بأسنان */}
                                    <rect x="10" y="29" width="10" height="12" rx="1.5" fill="url(#lampBrass)" />
                                    <path d="M10 33h10M10 36.5h10" className="lamp-thread" />
                                    <rect x="11.5" y="40.5" width="7" height="2.5" rx="1" fill="#3a2a16" />
                                    {/* زجاجة مدورة والفتيل */}
                                    <path className="lamp-glass" d="M12 43c0 3-8.5 5.5-8.5 17a11.5 11.5 0 0 0 23 0c0-11.5-8.5-14-8.5-17z" />
                                    <path className="lamp-wires" d="M13 43v14M17 43v14" />
                                    <path className="lamp-filament" d="M12.6 57l.9-2.2.9 2.2.9-2.2.9 2.2.9-2.2.9 2.2" />
                                    <ellipse cx="9" cy="59" rx="1.8" ry="5" className="lamp-shine" />
                                </g>
                            </svg>
                        </button>
                    )})()}
                </div>

                <div className="nav-letters" dir="ltr" aria-hidden="true">
                    {/* من اليسار: نصيب، ثم مجتهد بالنص، ثم لكل قرب اليمين، والحروف في الفراغات بينها.
                        الكلمات تختفي في الجوال فقط */}
                    {gap(0.4)}{letter('E')}{gap(1)}{letter('S')}
                    <i className={`nav-gap${showMotto ? ' gap-before-naseeb' : ''}`} style={{ flexGrow: 1.6 }} />
                    {showMotto && (
                        <svg className="nav-word word-naseeb" viewBox="0 0 230 72" style={{ aspectRatio: '230 / 72' }}>
                            <text x="205" y="40" textAnchor="middle" style={{ fontSize: 40 }}>”</text>
                            <text x="115" y="54" textAnchor="middle" direction="rtl" style={{ fontSize: 50 }}>نَصِيبٌ</text>
                            <text x="25" y="40" textAnchor="middle" style={{ fontSize: 40 }}>“</text>
                        </svg>
                    )}
                    {gap(1.3)}{letter('P')}{gap(0.8)}{letter('R')}{gap(1.3)}
                    {showMotto && (
                        <svg className="nav-word word-mjtahid" viewBox="0 0 210 64" style={{ aspectRatio: '210 / 64' }}>
                            <rect x="8" y="34" width="7" height="7" transform="rotate(45 11.5 37.5)" />
                            <text x="105" y="46" textAnchor="middle" direction="rtl" style={{ fontSize: 38 }}>مُجْتَهِدٍ</text>
                            <rect x="195" y="34" width="7" height="7" transform="rotate(45 198.5 37.5)" />
                        </svg>
                    )}
                    {gap(1.3)}{letter('M')}{gap(0.8)}{letter('A')}{gap(0.8)}{letter('T')}{gap(1.3)}
                    {showMotto && (
                        <svg className="nav-word word-lkl" viewBox="0 0 110 64" style={{ aspectRatio: '110 / 64' }}>
                            <text x="55" y="46" textAnchor="middle" direction="rtl" style={{ fontSize: 36 }}>لِكُلِّ</text>
                        </svg>
                    )}
                    {gap(1.4)}{letter('H')}{gap(0.4)}
                </div>

                {/* 2. مجموعة اليسار: موعد الاختبار (بجانب الملف الشخصي مباشرة) + الملف الشخصي */}
                <div className="nav-left-group" ref={leftGroupRef}>
                    {/* زر موعد الاختبار يأتي يمين الملف الشخصي مباشرة */}
                    {mobileAction && <div className="mobile-action">{mobileAction}</div>}

                    {/* موعد الاختبار للشاشات الأكبر من الجوال فقط */}
                    {isLoggedIn && !isHomePage && courseApprovalStatus && (
                        <div className="exam-date-slot">
                            {isExamPromptMinimized ? (
                                <button
                                    type="button"
                                    onClick={() => handleToggleMinimize(false)}
                                    title="إظهار مؤشر موعد الاختبار"
                                    data-tour="exam-date"
                                    style={{
                                        height: 'var(--btn-height)',
                                        padding: '0 var(--btn-padding-x)',
                                        borderRadius: '8px',
                                        backgroundColor: examDate ? (isUrgent ? '#fee2e2' : '#ffffff') : '#ffffff',
                                        border: '1px solid #6B5744',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--btn-font-size)',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        flexShrink: 0,
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    📝
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowCalendarModal(true)}
                                    data-tour="exam-date"
                                    style={{
                                        height: 'var(--btn-height)',
                                        padding: '0 var(--btn-padding-x)',
                                        backgroundColor: hasUpcomingExam ? (isUrgent ? '#fee2e2' : '#ffffff') : '#ffffff',
                                        color: hasUpcomingExam ? (isUrgent ? '#991b1b' : '#2C3531') : '#2C3531',
                                        border: '1px solid #6B5744',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: 'var(--btn-font-size)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        whiteSpace: 'nowrap',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <span>{hasUpcomingExam ? (isUrgent ? '🚨' : '⏳') : '📌'}</span>
                                    <span>
                                        {/* بعد مرور الموعد يرجع الزر يطلب موعدًا جديدًا */}
                                        {hasUpcomingExam
                                            ? (daysLeft === 0
                                                ? 'اختبارك اليوم 🎯'
                                                : daysLeft === 1
                                                    ? 'باقي: يوم 🎯'
                                                    : daysLeft === 2
                                                        ? 'باقي: يومين 🎯'
                                                        : daysLeft! >= 3 && daysLeft! <= 10
                                                            ? `باقي: ${daysLeft} أيام 🎯`
                                                            : `باقي: ${daysLeft} يوم 🎯`)
                                            : 'تحديد موعد الاختبار'}
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {isLoggedIn ? (
                        <div style={{ position: 'relative' }} ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setShowMenu(!showMenu)}
                                style={{
                                    height: 'var(--btn-height)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0 var(--btn-padding-x)',
                                    backgroundColor: '#ffffff',
                                    color: '#2C3531',
                                    border: '1px solid #6B5744',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: 'var(--btn-font-size)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    whiteSpace: 'nowrap',
                                    boxSizing: 'border-box'
                                }}
                            >
                                👤 {userName || 'الملف الشخصي'} ▾
                            </button>

                            {showMenu && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '120%',
                                    width: '280px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    zIndex: 50,
                                    border: '1px solid #6B5744',
                                    textAlign: 'right',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B5744' }}>الحساب المسجل:</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#2C3531' }}>{userName}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#7C9E6B', fontWeight: 'bold' }}>
                                                    {studentId ? <span dir="ltr">@{studentId}</span> : 'بدون اسم مستخدم'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowEditModal(true)}
                                                title="تعديل بيانات الملف الشخصي"
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    backgroundColor: '#ffffff',
                                                    border: '2px solid #C4863A',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <span style={{ fontSize: '11px', lineHeight: 1 }}>✏️</span>
                                            </button>
                                        </div>
                                        <p style={{ margin: '4px 0 6px 0', fontSize: '0.75rem', color: '#6B5744', wordBreak: 'break-all' }}>{userEmail}</p>

                                        <div style={{
                                            marginTop: '8px',
                                            padding: '6px 10px',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.75rem', color: '#6B5744', fontWeight: 'bold' }}>حالة الكورس:</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: courseApprovalStatus ? '#e2f8ec' : '#fef3c7',
                                                color: courseApprovalStatus ? '#166534' : '#b45309'
                                            }}>
                                                {courseApprovalStatus ? '✅ مفعل' : '⏳ بانتظار الموافقة'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { setShowMenu(false); setShowPasswordModal(true); }}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            marginBottom: '8px',
                                            backgroundColor: '#FEECD0',
                                            color: '#8B5E3C',
                                            border: '1px solid #8B5E3C',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        🔑 تغيير كلمة المرور
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            backgroundColor: '#b91c1c',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        تسجيل الخروج 🚪
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }} ref={authDropdownRef} onMouseEnter={() => setShowAuthDropdown(true)} onMouseLeave={() => setShowAuthDropdown(false)}>
                            <button
                                type="button"
                                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                                style={{
                                    height: 'var(--btn-height)',
                                    padding: '0 var(--btn-padding-x)',
                                    backgroundColor: '#ffffff',
                                    color: '#2C3531',
                                    border: '1px solid #6B5744',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: 'var(--btn-font-size)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    whiteSpace: 'nowrap',
                                    boxSizing: 'border-box'
                                }}
                            >
                                تسجيل الدخول ▾
                            </button>
                            {showAuthDropdown && (
                                <div style={{ position: 'absolute', left: 0, top: '100%', paddingTop: '8px', width: '160px', zIndex: 50 }}>
                                    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px', padding: '0.5rem', border: '1px solid #6B5744', display: 'flex', flexDirection: 'column', gap: '4px', boxSizing: 'border-box' }}>
                                        <Link href="/login" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#2C3531', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                                            🔑 تسجيل دخول
                                        </Link>
                                        <Link href="/signup" onClick={() => setShowAuthDropdown(false)} style={{ textDecoration: 'none', color: '#ffffff', backgroundColor: '#7C9E6B', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 'bold', textAlign: 'center' }}>
                                            ✨ إنشاء حساب
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* مودال تعديل الملف الشخصي */}
            {showEditModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'right', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3531' }}>✏️ تعديل بيانات الملف الشخصي</h3>
                            <button type="button" onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>الاسم الكامل:</label>
                                <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>اسم المستخدم (اختياري):</label>
                                <input type="text" dir="ltr" value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)} placeholder="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', textAlign: 'right' }} />
                                <div style={{ fontSize: '0.72rem', color: '#6B5744', marginTop: '4px' }}>حروف إنجليزية وأرقام و _ فقط. اتركه فاضي إذا ما تبي.</div>
                            </div>
                            <button type="submit" disabled={loadingName} style={{ width: '100%', padding: '10px', backgroundColor: '#7C9E6B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', boxSizing: 'border-box' }}>
                                {loadingName ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال تغيير كلمة المرور */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '380px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'right', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3531' }}>🔑 تغيير كلمة المرور</h3>
                            <button type="button" onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>كلمة المرور الحالية:</label>
                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>كلمة المرور الجديدة:</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder={`${MIN_PASSWORD} أحرف على الأقل`} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#6B5744' }}>تأكيد كلمة المرور الجديدة:</label>
                                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <button type="submit" disabled={loadingPassword} style={{ width: '100%', padding: '10px', backgroundColor: '#8B5E3C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', boxSizing: 'border-box' }}>
                                {loadingPassword ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* مودال التقويم لتحديد موعد الاختبار */}
            {showCalendarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2500, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '340px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', color: '#2C3531' }}>📅 تحديد موعد الاختبار</h3>
                            <button type="button" onClick={() => setShowCalendarModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6B5744' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(prev => Math.max(0, prev - 1))}
                                disabled={currentMonthOffset === 0}
                                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', cursor: currentMonthOffset === 0 ? 'not-allowed' : 'pointer', opacity: currentMonthOffset === 0 ? 0.4 : 1 }}
                            >
                                ▶
                            </button>
                            <span>{monthNames[month]} {year}</span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonthOffset(prev => Math.min(1, prev + 1))}
                                disabled={currentMonthOffset === 1}
                                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', cursor: currentMonthOffset === 1 ? 'not-allowed' : 'pointer', opacity: currentMonthOffset === 1 ? 0.4 : 1 }}
                            >
                                ◀
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#6B5744' }}>
                            <span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                            {calendarDays.map((dayStr, idx) => {
                                if (!dayStr) return <div key={idx} />
                                const dayNum = parseInt(dayStr.split('-')[2])
                                const isSelected = examDate === dayStr
                                const isToday = dayStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

                                const dayDate = new Date(dayStr)
                                dayDate.setHours(0, 0, 0, 0)
                                const isPast = dayDate < today

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isPast}
                                        onClick={() => !isPast && saveSelectedDateToSupabase(dayStr)}
                                        style={{
                                            padding: '8px 0',
                                            backgroundColor: isSelected ? '#8B5E3C' : isToday ? '#FEECD0' : '#f8fafc',
                                            color: isSelected ? '#fff' : isPast ? '#cbd5e1' : '#2C3531',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            cursor: isPast ? 'not-allowed' : 'pointer',
                                            opacity: isPast ? 0.5 : 1
                                        }}
                                    >
                                        {dayNum}
                                    </button>
                                )
                            })}
                        </div>
                        {examDate && (
                            <button
                                type="button"
                                onClick={() => handleToggleMinimize(true)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box'
                                }}
                            >
                                تصغير المؤشر للشاشة 📉
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* مودال التنبيهات العامة */}
            {showAlertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, fontFamily: 'sans-serif', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #6B5744', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '320px', boxShadow: '0 15px 30px rgba(0,0,0,0.15)', color: '#2C3531', textAlign: 'center', boxSizing: 'border-box' }}>
                        <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', fontWeight: 'bold', lineHeight: '1.5' }}>{alertMessage}</p>
                        <button
                            type="button"
                            onClick={() => setShowAlertModal(false)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#8B5E3C',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxSizing: 'border-box'
                            }}
                        >
                            حسناً
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}