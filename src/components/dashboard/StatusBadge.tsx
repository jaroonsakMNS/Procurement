import type { StatusKey } from '../../types/procurement'

const STATUS_MAP: Record<StatusKey, { label: string; className: string }> = {
  ready_for_po: {
    label: 'พร้อมเปิด PO',
    className: 'bg-teal-50 text-teal-700 ring-teal-200',
  },
  po_created: {
    label: 'เปิด PO แล้ว',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  draft: {
    label: 'ร่าง',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  pending_approval: {
    label: 'รอผู้จัดการอนุมัติ',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  sent_to_vendor: {
    label: 'ส่งให้ร้านค้า',
    className: 'bg-sky-50 text-sky-700 ring-sky-200',
  },
  in_transit: {
    label: 'กำลังจัดส่ง',
    className: 'bg-sky-50 text-sky-700 ring-sky-200',
  },
  partial: {
    label: 'รับบางส่วน',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  ready: {
    label: 'พร้อมรับของ',
    className: 'bg-teal-50 text-teal-700 ring-teal-200',
  },
  received: {
    label: 'รับของแล้ว',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  overdue: {
    label: 'เกินกำหนด',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  ordered: {
    label: 'สั่งซื้อแล้ว',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  pending_order: {
    label: 'รอสั่งซื้อ',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  },
  issued: {
    label: 'เบิกจ่ายแล้ว',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  delivered: {
    label: 'รับของเข้าคลัง',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  pending: {
    label: 'รอจัดซื้อ',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  on_po: {
    label: 'อยู่ใน PO',
    className: 'bg-sky-50 text-sky-700 ring-sky-200',
  },
  low_stock: {
    label: 'สต็อกต่ำ',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  in_stock: {
    label: 'มีของในคลัง',
    className: 'bg-teal-50 text-teal-700 ring-teal-200',
  },
  out_of_stock: {
    label: 'ของหมด',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  pending_quote: {
    label: 'กำลังเสนอราคา',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  po_issued: {
    label: 'สั่งซื้อแล้ว/รอรับของ',
    className: 'bg-sky-50 text-sky-800 ring-sky-200',
  },
  delivered_pending_payment: {
    label: 'รับของแล้ว/รอจ่ายเงิน',
    className: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  },
  ready_for_use: {
    label: 'พร้อมใช้',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
}

interface StatusBadgeProps {
  status: StatusKey | string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_MAP[status as StatusKey] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  )
}
