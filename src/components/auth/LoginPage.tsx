import { useState } from 'react'
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'
import { WORK_GROUPS } from '../../data/workGroups'
import { ROLE_LABEL } from '../../lib/permissions'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { employees, login } = useAuth()
  const [email, setEmail] = useState('admin@mns.local')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const demos = employees.filter((item) => item.active)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-slate-950" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-sky-100 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              MNS Operations
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">ระบบปฏิบัติการโรงงาน</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              จัดซื้อ บัญชี ผลิต และขาย ในที่เดียว — เข้าสู่ระบบด้วยบัญชีพนักงานเพื่อเห็นเมนูตามสิทธิ์
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            {WORK_GROUPS.map((group) => (
              <li key={group.id} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${group.accent}`} />
                {group.label}
                <span className="text-slate-500">· {group.hint}</span>
              </li>
            ))}
          </ul>
        </aside>

        <form
          className="bg-white p-8 sm:p-10"
          onSubmit={(event) => {
            event.preventDefault()
            const message = login(email, password)
            setError(message ?? '')
          }}
        >
          <div className="mb-8 lg:hidden">
            <p className="text-lg font-semibold text-slate-900">ระบบปฏิบัติการ MNS</p>
            <p className="text-xs text-slate-500">เข้าสู่ระบบด้วยบัญชีพนักงาน</p>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">เข้าสู่ระบบ</h2>
          <p className="mt-1 text-sm text-slate-500">ใช้บัญชีทดลองด้านล่าง หรือกรอกอีเมลของตัวเอง</p>

          <label className="mt-6 block text-xs font-medium text-slate-600">
            อีเมล
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </label>

          <label className="mt-4 block text-xs font-medium text-slate-600">
            รหัสผ่าน
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </label>

          {error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            เข้าสู่ระบบ
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-8 text-xs font-medium tracking-wide text-slate-400 uppercase">บัญชีทดลอง</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {demos.map((item) => {
              const group = WORK_GROUPS.find((entry) => entry.id === item.department)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(item.email)
                      setPassword(item.password)
                      setError('')
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:border-sky-300 hover:bg-sky-50/60"
                  >
                    <p className="truncate text-xs font-medium text-slate-800">{item.name}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {ROLE_LABEL[item.role]} · {group?.label}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        </form>
      </div>
    </div>
  )
}
