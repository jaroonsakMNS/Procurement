import { Check, CreditCard, TrendingDown, AlertCircle } from 'lucide-react'
import StatusBadge from '../components/dashboard/StatusBadge'
import { formatCurrency, formatDate, isOverdue } from '../lib/format'
import type { PendingPayment } from '../types/procurement'

interface PaymentsViewProps {
  payments: PendingPayment[]
  paidPayments: PendingPayment[]
  onMarkPaid: (poNumber: string) => void
}

export default function PaymentsView({ payments, paidPayments, onMarkPaid }: PaymentsViewProps) {
  const unpaidPayments = payments
  const totalOutstanding = unpaidPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)
  const overdueCount = unpaidPayments.filter((p) => isOverdue(p.dueDate)).length

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-orange-500" />
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">ค้างชำระรวม</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
              <p className="text-xs text-slate-500">{unpaidPayments.length} รายการ</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className={`h-1 ${overdueCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <div className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-2.5 ${overdueCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">เกินกำหนด</p>
              <p className={`mt-1 text-xl font-bold ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {overdueCount} รายการ
              </p>
              <p className="text-xs text-slate-500">ต้องชำระด่วน</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-emerald-500" />
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">ชำระแล้ว (Session)</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-slate-500">{paidPayments.length} รายการที่ชำระแล้ว</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending payments table */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">รายการค้างชำระเงิน (Pending Payments)</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            เรียงตามวันครบกำหนดที่ใกล้ที่สุด — กด "ชำระแล้ว" เพื่ออัพเดทสถานะ
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">เลขที่ PO / Invoice</th>
                <th className="px-5 py-3 font-medium">ร้านค้า (Vendor)</th>
                <th className="px-5 py-3 text-right font-medium">จำนวนเงิน (THB)</th>
                <th className="px-5 py-3 font-medium">วันครบกำหนด</th>
                <th className="px-5 py-3 font-medium">สถานะ</th>
                <th className="px-5 py-3 text-right font-medium">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unpaidPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-sm font-medium text-emerald-700">ชำระเงินครบทุกรายการแล้ว</p>
                    <p className="mt-1 text-xs text-slate-400">ไม่มียอดค้างชำระในขณะนี้</p>
                  </td>
                </tr>
              ) : (
                unpaidPayments.map((payment) => {
                  const overdue = isOverdue(payment.dueDate)

                  return (
                    <tr
                      key={payment.poNumber}
                      className={overdue ? 'bg-rose-50/60 hover:bg-rose-50' : 'hover:bg-slate-50/80'}
                    >
                      <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                        {payment.poNumber}
                      </td>
                      <td className="px-5 py-3 text-slate-700">{payment.vendorName}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums whitespace-nowrap text-slate-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <p className={overdue ? 'font-medium text-rose-700' : 'text-slate-700'}>
                          {formatDate(payment.dueDate)}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        {overdue ? <StatusBadge status="overdue" /> : <StatusBadge status="pending" />}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onMarkPaid(payment.poNumber)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          ชำระแล้ว
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paid this session */}
      {paidPayments.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">ชำระแล้วในเซสชันนี้</h2>
            <p className="mt-0.5 text-xs text-slate-500">Paid records created from the active mock workflow</p>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">เลขที่ PO</th>
                  <th className="px-5 py-3 font-medium">ร้านค้า</th>
                  <th className="px-5 py-3 text-right font-medium">จำนวนเงิน</th>
                  <th className="px-5 py-3 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paidPayments.map((payment) => (
                  <tr key={payment.poNumber} className="bg-emerald-50/30">
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-600">
                      {payment.poNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{payment.vendorName}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
                        <Check className="h-3 w-3" />
                        ชำระแล้ว
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
