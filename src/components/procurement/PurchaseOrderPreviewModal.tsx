import { Printer, X } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import type { PurchaseOrder } from '../../types/procurement'

interface PurchaseOrderPreviewModalProps {
  purchaseOrder: PurchaseOrder | null
  onClose: () => void
}

export default function PurchaseOrderPreviewModal({
  purchaseOrder,
  onClose,
}: PurchaseOrderPreviewModalProps) {
  if (!purchaseOrder) {
    return null
  }

  const totalQty = purchaseOrder.lines.reduce((sum, line) => sum + line.qty, 0)

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:p-8">
      <div className="my-4 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-xl print:max-w-none print:border-0 print:shadow-none">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 print:hidden">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Official Purchase Order</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{purchaseOrder.poNumber}</h2>
            <p className="text-sm text-slate-500">Preview and print-ready procurement document</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Printer className="h-4 w-4" />
              Print PO
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="ปิด"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="space-y-6 px-6 py-6">
          <section className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Vendor</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{purchaseOrder.vendorName}</h3>
              <p className="mt-2 text-sm text-slate-500">PO Number: {purchaseOrder.poNumber}</p>
              <p className="text-sm text-slate-500">Created: {purchaseOrder.createdDate ?? '—'}</p>
              <p className="text-sm text-slate-500">Stage: {purchaseOrder.stage}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Summary</p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Total line items</p>
                  <p className="font-semibold text-slate-900">{purchaseOrder.lines.length}</p>
                </div>
                <div>
                  <p className="text-slate-500">Total quantity</p>
                  <p className="font-semibold text-slate-900">{totalQty}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500">Amount</p>
                  <p className="text-xl font-bold text-teal-700">{formatCurrency(purchaseOrder.amount)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Part No</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                  <th className="px-4 py-3 text-right font-medium">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrder.lines.map((line) => (
                  <tr key={`${purchaseOrder.poNumber}-${line.partNo}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{line.partNo}</td>
                    <td className="px-4 py-3 text-slate-600">{line.description}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{line.qty}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(line.unitPrice)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-900">
                      {formatCurrency(line.qty * line.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {purchaseOrder.comparison?.quotes?.length ? (
            <section className="rounded-2xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">3-Vendor Comparison Snapshot</h4>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {purchaseOrder.comparison.quotes.map((quote) => (
                  <div
                    key={`${purchaseOrder.poNumber}-${quote.vendorId}`}
                    className={`rounded-xl border p-3 ${
                      quote.vendorId === purchaseOrder.comparison?.winnerVendorId
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{quote.vendorName}</p>
                    <p className="mt-1 text-xs text-slate-500">{quote.lines.length} quoted lines</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{formatCurrency(quote.total)}</p>
                    {quote.vendorId === purchaseOrder.comparison?.winnerVendorId ? (
                      <p className="mt-1 text-xs font-medium text-teal-700">Winning vendor</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
