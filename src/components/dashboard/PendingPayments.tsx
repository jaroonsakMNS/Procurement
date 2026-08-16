import { formatCurrency, formatDate, isOverdue } from '../../lib/format'
import type { PendingPayment } from '../../types/procurement'
import StatusBadge from './StatusBadge'

interface PendingPaymentsProps {
  payments: PendingPayment[]
}

export default function PendingPayments({ payments }: PendingPaymentsProps) {
  return (
    <section
      id="payments"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">ค้างชำระเงิน</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Pending Payments — เรียงตามวันครบกำหนดที่ใกล้ที่สุด
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">เลขที่ PO</th>
              <th className="px-5 py-3 font-medium">ร้านค้า (Vendor)</th>
              <th className="px-5 py-3 font-medium">จำนวนเงิน (Amount)</th>
              <th className="px-5 py-3 font-medium">วันครบกำหนด (Due Date)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  ไม่พบรายการที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              payments.map((item) => {
                const overdue = isOverdue(item.dueDate)

                return (
                  <tr
                    key={item.poNumber}
                    className={overdue ? 'bg-rose-50/60 hover:bg-rose-50' : 'hover:bg-slate-50/80'}
                  >
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                      {item.poNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{item.vendorName}</td>
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={overdue ? 'font-medium text-rose-700' : 'text-slate-700'}>
                          {formatDate(item.dueDate)}
                        </span>
                        {overdue ? <StatusBadge status="overdue" /> : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
