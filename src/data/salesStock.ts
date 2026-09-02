import type { SalesStockItem } from '../types/procurement'

export const salesStock: SalesStockItem[] = [
  { sku: '022010-0044', sellPrice: 135, minSellQty: 10, note: 'หลอดไฟโครงการบ้าน/โรงแรม' },
  { sku: '041010-0101', sellPrice: 2350, minSellQty: 1, note: 'เบรกเกอร์ขายให้ลูกค้าอาคาร' },
  { sku: '050010-0001', sellPrice: 12, minSellQty: 20, note: 'ฟิวส์สำรอง' },
  { sku: '033010-0012', sellPrice: 18, minSellQty: 50, note: 'โฟโต้คัปเปลอร์' },
  { sku: '013010-0006', sellPrice: 28, minSellQty: 10 },
]
