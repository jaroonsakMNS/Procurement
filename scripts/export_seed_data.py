# -*- coding: utf-8 -*-
"""Export complete seed data for running the procurement system."""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(r"D:\AI CURSOR\Data")
JSON_DIR = ROOT / "json"
CSV_DIR = ROOT / "csv"

WORK_GROUPS = [
    {
        "id": "purchasing",
        "labelTh": "กลุ่มจัดซื้อ",
        "labelEn": "Purchasing",
        "description": "รอจัดซื้อ, เปรียบเทียบราคา, PO และร้านค้า",
        "modules": [
            "dashboard",
            "jobs",
            "job-equipment",
            "job-status-report",
            "pending-purchase",
            "vendors",
            "purchase-orders",
            "deliveries",
        ],
    },
    {
        "id": "accounting",
        "labelTh": "กลุ่มบัญชี",
        "labelEn": "Accounting",
        "description": "การชำระเงิน, PO และเอกสารรับของ",
        "modules": ["dashboard", "purchase-orders", "payments", "deliveries"],
    },
    {
        "id": "production",
        "labelTh": "กลุ่มผลิต",
        "labelEn": "Production",
        "description": "จ๊อบ, คลัง, เบิกของ และติดตามอุปกรณ์",
        "modules": [
            "dashboard",
            "jobs",
            "job-equipment",
            "job-status-report",
            "deliveries",
            "inventory",
            "store",
        ],
    },
    {
        "id": "sales",
        "labelTh": "กลุ่มขาย",
        "labelEn": "Sales",
        "description": "ลูกค้า และสต็อกที่ต้องการขาย",
        "modules": ["dashboard", "customers", "sales-stock"],
    },
]

EMPLOYEES = [
    {
        "id": "EMP-001",
        "employeeCode": "MNS-0001",
        "name": "สมชาย จันทร์เพ็ญ",
        "email": "admin@mns.local",
        "password": "admin123",
        "phone": "081-000-0001",
        "position": "ผู้ดูแลระบบ",
        "role": "admin",
        "department": "purchasing",
        "extraDepartments": ["accounting", "production", "sales"],
        "permissions": ["view", "operate", "approve", "receive", "manage_staff"],
        "active": True,
    },
    {
        "id": "EMP-002",
        "employeeCode": "MNS-0101",
        "name": "วิภา จัดซื้อ",
        "email": "purchase.mgr@mns.local",
        "password": "mgr123",
        "phone": "081-111-0101",
        "position": "หัวหน้าแผนกจัดซื้อ",
        "role": "manager",
        "department": "purchasing",
        "extraDepartments": [],
        "permissions": ["view", "operate", "approve", "receive"],
        "active": True,
    },
    {
        "id": "EMP-003",
        "employeeCode": "MNS-0102",
        "name": "อนุชา จัดซื้อ",
        "email": "purchase@mns.local",
        "password": "purchase123",
        "phone": "081-111-0102",
        "position": "เจ้าหน้าที่จัดซื้อ",
        "role": "staff",
        "department": "purchasing",
        "extraDepartments": [],
        "permissions": ["view", "operate"],
        "active": True,
    },
    {
        "id": "EMP-004",
        "employeeCode": "MNS-0201",
        "name": "นภาพร การบัญชี",
        "email": "account.mgr@mns.local",
        "password": "mgr123",
        "phone": "081-222-0201",
        "position": "หัวหน้าแผนกบัญชี",
        "role": "manager",
        "department": "accounting",
        "extraDepartments": [],
        "permissions": ["view", "operate", "approve"],
        "active": True,
    },
    {
        "id": "EMP-005",
        "employeeCode": "MNS-0202",
        "name": "ศิริพร การเงิน",
        "email": "account@mns.local",
        "password": "account123",
        "phone": "081-222-0202",
        "position": "เจ้าหน้าที่บัญชี",
        "role": "staff",
        "department": "accounting",
        "extraDepartments": [],
        "permissions": ["view"],
        "active": True,
    },
    {
        "id": "EMP-006",
        "employeeCode": "MNS-0301",
        "name": "กิตติพงษ์ ช่างโครงการ",
        "email": "site@mns.local",
        "password": "site123",
        "phone": "081-333-0301",
        "position": "หัวหน้าไซต์งาน",
        "role": "manager",
        "department": "production",
        "extraDepartments": [],
        "permissions": ["view", "operate", "approve", "receive"],
        "active": True,
    },
    {
        "id": "EMP-007",
        "employeeCode": "MNS-0302",
        "name": "วราภรณ์ คลังสินค้า",
        "email": "staff@mns.local",
        "password": "staff123",
        "phone": "081-333-0302",
        "position": "พนักงานคลัง",
        "role": "staff",
        "department": "production",
        "extraDepartments": [],
        "permissions": ["view", "operate", "receive"],
        "active": True,
    },
    {
        "id": "EMP-008",
        "employeeCode": "MNS-0401",
        "name": "ปิยะดา ฝ่ายขาย",
        "email": "sales.mgr@mns.local",
        "password": "mgr123",
        "phone": "081-444-0401",
        "position": "หัวหน้าฝ่ายขาย",
        "role": "manager",
        "department": "sales",
        "extraDepartments": [],
        "permissions": ["view", "operate", "approve"],
        "active": True,
    },
    {
        "id": "EMP-009",
        "employeeCode": "MNS-0402",
        "name": "ธนพล เซลล์",
        "email": "sales@mns.local",
        "password": "sales123",
        "phone": "081-444-0402",
        "position": "พนักงานขาย",
        "role": "staff",
        "department": "sales",
        "extraDepartments": [],
        "permissions": ["view", "operate"],
        "active": True,
    },
]

SETTINGS = {
    "company": {
        "name": "บจก. เอ็มเอ็นเอส เอ็นจิเนียริ่ง",
        "nameEn": "MNS Engineering Co., Ltd.",
        "taxId": "0105559000001",
        "address": "88/9 ถ.พระราม 9 เขตห้วยขวาง กรุงเทพฯ 10310",
        "phone": "02-000-8800",
        "email": "procurement@mns.local",
        "currency": "THB",
        "locale": "th-TH",
    },
    "po": {
        "prefix": "PO",
        "yearMonth": "2608",
        "nextSeq": 13,
        "requireThreeVendorQuotes": True,
    },
    "job": {
        "prefix": "JOB",
        "year": "2026",
        "nextSeq": 143,
    },
    "warehouse": {
        "defaultLocationPrefix": "A",
        "defaultMinStock": 5,
        "defaultUnit": "ชิ้น",
    },
}

STATUS_DICTIONARY = {
    "jobStatus": [
        {"id": "ready_for_po", "labelTh": "พร้อมเปิด PO", "labelEn": "Ready for PO"},
        {"id": "po_created", "labelTh": "เปิด PO แล้ว", "labelEn": "PO created"},
    ],
    "poStage": [
        {"id": "draft", "labelTh": "ร่าง", "labelEn": "Draft"},
        {"id": "pending_approval", "labelTh": "รอผู้จัดการอนุมัติ", "labelEn": "Pending approval"},
        {"id": "sent_to_vendor", "labelTh": "ส่งให้ร้านค้า", "labelEn": "Sent to vendor"},
        {"id": "delivered", "labelTh": "รับของเข้าคลัง", "labelEn": "Delivered"},
    ],
    "equipmentOrderStatus": [
        {"id": "pending_order", "labelTh": "รอสั่งซื้อ", "labelEn": "Pending order"},
        {"id": "ordered", "labelTh": "สั่งซื้อแล้ว", "labelEn": "Ordered"},
        {"id": "received", "labelTh": "รับของแล้ว", "labelEn": "Received"},
        {"id": "issued", "labelTh": "เบิกจ่ายแล้ว", "labelEn": "Issued"},
    ],
    "trackStatus": [
        {"id": "pending_quote", "labelTh": "กำลังเสนอราคา", "labelEn": "Pending quote"},
        {"id": "po_issued", "labelTh": "สั่งซื้อแล้ว/รอรับของ", "labelEn": "PO issued"},
        {"id": "delivered_pending_payment", "labelTh": "รับของแล้ว/รอจ่ายเงิน", "labelEn": "Delivered pending payment"},
        {"id": "ready_for_use", "labelTh": "พร้อมใช้", "labelEn": "Ready for use"},
    ],
    "pendingPurchaseStatus": [
        {"id": "pending", "labelTh": "รอจัดซื้อ", "labelEn": "Pending"},
        {"id": "on_po", "labelTh": "อยู่ใน PO", "labelEn": "On PO"},
    ],
    "stockStatus": [
        {"id": "in_stock", "labelTh": "มีของในคลัง", "labelEn": "In stock"},
        {"id": "low_stock", "labelTh": "สต็อกต่ำ", "labelEn": "Low stock"},
        {"id": "out_of_stock", "labelTh": "ของหมด", "labelEn": "Out of stock"},
    ],
    "deliveryProgress": [
        {"id": "in_transit", "labelTh": "กำลังจัดส่ง", "labelEn": "In transit"},
        {"id": "partial", "labelTh": "รับบางส่วน", "labelEn": "Partial"},
        {"id": "ready", "labelTh": "พร้อมรับของ", "labelEn": "Ready"},
        {"id": "received", "labelTh": "รับของแล้ว", "labelEn": "Received"},
    ],
}

VENDORS = [
    {
        "id": "VEN-001",
        "name": "บจก. สยามสตีล",
        "contactPerson": "คุณวิชัย เหล็กดี",
        "phone": "02-111-2001",
        "email": "sales@siamsteel.example",
        "address": "99 ถ.พระราม 2 เขตบางขุนเทียน กรุงเทพฯ 10150",
        "taxId": "0105558123001",
        "active": True,
    },
    {
        "id": "VEN-002",
        "name": "หจก. นครปูนซีเมนต์",
        "contactPerson": "คุณศิริ ปูนขาว",
        "phone": "02-222-3400",
        "email": "order@nakorncement.example",
        "address": "12 นิคมอุตสาหกรรมบางปะกง ฉะเชิงเทรา 24130",
        "taxId": "0125556002218",
        "active": True,
    },
    {
        "id": "VEN-003",
        "name": "บจก. ไทยไลท์ติ้ง",
        "contactPerson": "คุณนภา แสงทอง",
        "phone": "02-333-1188",
        "email": "contact@thailighting.example",
        "address": "88 ถ.ลาดพร้าว เขตวังทองหลาง กรุงเทพฯ 10310",
        "taxId": "0105559011452",
        "active": True,
    },
    {
        "id": "VEN-004",
        "name": "บจก. กรีนวู้ด ซัพพลาย",
        "contactPerson": "คุณประยุทธ์ ไม้เขียว",
        "phone": "02-444-7722",
        "email": "sales@greenwood.example",
        "address": "45 หมู่ 3 ต.คลองหนึ่ง คลองหลวง ปทุมธานี 12120",
        "taxId": "0135554008891",
        "active": True,
    },
    {
        "id": "VEN-005",
        "name": "บจก. เอเชียกลาส",
        "contactPerson": "คุณอรทัย แก้วใส",
        "phone": "02-555-9090",
        "email": "asia@asiaglass.example",
        "address": "21 บางนา-ตราด กม.16 สมุทรปราการ 10540",
        "taxId": "0115557003344",
        "active": True,
    },
    {
        "id": "VEN-006",
        "name": "บจก. เมทัลเวิร์ค ไทย",
        "contactPerson": "คุณสมบูรณ์ เหล็กกล",
        "phone": "02-666-2211",
        "email": "po@metalworkthai.example",
        "address": "7 ซอยสุขสวัสดิ์ 30 เขตราษฎร์บูรณะ กรุงเทพฯ 10140",
        "taxId": "0105552201789",
        "active": True,
    },
    {
        "id": "VEN-007",
        "name": "บจก. ยูไนเต็ดทูลส์",
        "contactPerson": "คุณมานพ เครื่องมือ",
        "phone": "02-777-3344",
        "email": "sales@unitedtools.example",
        "address": "15 ถ.เพชรบุรีตัดใหม่ เขตราชเทวี กรุงเทพฯ 10400",
        "taxId": "0105553302211",
        "active": True,
    },
]

JOBS = [
    {
        "jobId": "JOB-2026-0142",
        "projectName": "โครงการคอนโดสุขุมวิท 39",
        "vendorName": "บจก. สยามสตีล",
        "description": "จัดซื้อเหล็กและอุปกรณ์ไฟฟ้าสำหรับงานโครงสร้างคอนโด",
        "status": "ready_for_po",
        "site": "สุขุมวิท 39 กรุงเทพฯ",
        "startDate": "2026-03-01",
        "dueDate": "2026-09-30",
    },
    {
        "jobId": "JOB-2026-0138",
        "projectName": "อาคารสำนักงานพระราม 9",
        "vendorName": "หจก. นครปูนซีเมนต์",
        "description": "งานระบบไฟฟ้าและเบรกเกอร์อาคารสำนักงาน",
        "status": "ready_for_po",
        "site": "พระราม 9 กรุงเทพฯ",
        "startDate": "2026-04-01",
        "dueDate": "2026-10-15",
    },
    {
        "jobId": "JOB-2026-0135",
        "projectName": "โรงแรมหัวหิน บีช",
        "vendorName": "บจก. ไทยไลท์ติ้ง",
        "description": "จัดซื้อโคมไฟและอุปกรณ์แสงสว่างโรงแรม",
        "status": "po_created",
        "site": "หัวหิน ประจวบคีรีขันธ์",
        "startDate": "2026-05-01",
        "dueDate": "2026-11-30",
    },
    {
        "jobId": "JOB-2026-0129",
        "projectName": "โครงการบ้านเดี่ยวรังสิต",
        "vendorName": "บจก. กรีนวู้ด ซัพพลาย",
        "description": "วัสดุตกแต่งและหลอดไฟสำหรับบ้านเดี่ยว",
        "status": "ready_for_po",
        "site": "รังสิต ปทุมธานี",
        "startDate": "2026-06-01",
        "dueDate": "2026-12-15",
    },
    {
        "jobId": "JOB-2026-0121",
        "projectName": "ศูนย์การค้าบางนา",
        "vendorName": "บจก. เอเชียกลาส",
        "description": "กระจกและวัสดุซุ้มทางเข้าศูนย์การค้า",
        "status": "po_created",
        "site": "บางนา สมุทรปราการ",
        "startDate": "2026-02-15",
        "dueDate": "2026-08-31",
    },
    {
        "jobId": "JOB-2026-0118",
        "projectName": "โกดังบางพลี เฟส 2",
        "vendorName": "บจก. เมทัลเวิร์ค ไทย",
        "description": "เหล็กโครงสร้างและแผ่นหลังคาโกดัง",
        "status": "ready_for_po",
        "site": "บางพลี สมุทรปราการ",
        "startDate": "2026-07-01",
        "dueDate": "2027-01-31",
    },
]

INVENTORY = [
    {"sku": "007010-0003", "mnsPartNo": "007010-0003", "partNo": "FDLL4148", "description": "Diode High Conductance 100V/200mA, SOD-80", "currentStock": 98, "minStock": 40, "unit": "ชิ้น", "location": "A-01", "unitPrice": 3},
    {"sku": "033010-0012", "mnsPartNo": "033010-0012", "partNo": "LTV-817S-TA1-C", "description": "Photocoupler Transistor Output 1 Channel", "currentStock": 200, "minStock": 50, "unit": "ชิ้น", "location": "A-02", "unitPrice": 12},
    {"sku": "013010-0006", "mnsPartNo": "013010-0006", "partNo": "CD4081BM96", "description": "Quad 2 Input AND Gates", "currentStock": 40, "minStock": 15, "unit": "ชิ้น", "location": "A-03", "unitPrice": 18},
    {"sku": "019011-0021", "mnsPartNo": "019011-0021", "partNo": "EK500V-2P", "description": "Screw Terminal Block 2Pins, Pitch 5.00mm", "currentStock": 60, "minStock": 40, "unit": "ชิ้น", "location": "A-04", "unitPrice": 9},
    {"sku": "008011-0038", "mnsPartNo": "008011-0038", "partNo": "L7808CV-DG", "description": "Positive Voltage Regulators 8V/1.5A", "currentStock": 5, "minStock": 10, "unit": "ชิ้น", "location": "A-05", "unitPrice": 25},
    {"sku": "002000-0071", "mnsPartNo": "002000-0071", "partNo": "CD4070BE DIP 14", "description": "Quad 2-Input XOR Logic Gate, 14-Pin PDIP", "currentStock": 7, "minStock": 10, "unit": "ชิ้น", "location": "A-06", "unitPrice": 16},
    {"sku": "013010-0007", "mnsPartNo": "013010-0007", "partNo": "CD4001BE", "description": "CMOS NOR Gate, Quad 2 Input", "currentStock": 12, "minStock": 10, "unit": "ชิ้น", "location": "A-07", "unitPrice": 14},
    {"sku": "013010-0008", "mnsPartNo": "013010-0008", "partNo": "CD4081BE", "description": "Quad 2 Input AND Gates", "currentStock": 12, "minStock": 10, "unit": "ชิ้น", "location": "A-08", "unitPrice": 15},
    {"sku": "008010-0022", "mnsPartNo": "008010-0022", "partNo": "MMBT5551", "description": "Transistor NPN 160V/600mA, Signal Processing", "currentStock": 60, "minStock": 20, "unit": "ชิ้น", "location": "A-09", "unitPrice": 4},
    {"sku": "013010-0009", "mnsPartNo": "013010-0009", "partNo": "NE555N", "description": "CMOS General Purpose Timer", "currentStock": 24, "minStock": 12, "unit": "ชิ้น", "location": "A-10", "unitPrice": 8},
    {"sku": "018010-0002", "mnsPartNo": "018010-0002", "partNo": "HL-PC-3216U51GC", "description": "Chip LED Green 600-800mcd", "currentStock": 4000, "minStock": 500, "unit": "ชิ้น", "location": "A-11", "unitPrice": 1},
    {"sku": "041010-0101", "mnsPartNo": "041010-0101", "partNo": "MCB-32A-3P", "description": "Circuit Breaker 32A 3P, IEC 60898", "currentStock": 2, "minStock": 6, "unit": "ชิ้น", "location": "C-01", "unitPrice": 1850},
    {"sku": "041010-0108", "mnsPartNo": "041010-0108", "partNo": "CABLE-NYY-4x16", "description": "Power Cable NYY 4x16 sq.mm. 100m/roll", "currentStock": 0, "minStock": 4, "unit": "ม้วน", "location": "C-08", "unitPrice": 4200},
    {"sku": "041010-0112", "mnsPartNo": "041010-0112", "partNo": "BUSBAR-CU-30x5", "description": "Copper Busbar 30×5 mm, 2 m", "currentStock": 0, "minStock": 8, "unit": "เส้น", "location": "C-09", "unitPrice": 680},
    {"sku": "041010-0094", "mnsPartNo": "041010-0094", "partNo": "MCB-16A-1P", "description": "Miniature Circuit Breaker 16A 1P", "currentStock": 24, "minStock": 10, "unit": "ชุด", "location": "C-02", "unitPrice": 220},
    {"sku": "041020-0033", "mnsPartNo": "041020-0033", "partNo": "CONDUIT-PVC-25", "description": "ท่อร้อยสาย PVC 25 มม. × 4 ม.", "currentStock": 80, "minStock": 20, "unit": "เส้น", "location": "C-12", "unitPrice": 45},
    {"sku": "041020-0041", "mnsPartNo": "041020-0041", "partNo": "GLAND-PG21", "description": "Cable Gland PG21, Nickel Plated", "currentStock": 0, "minStock": 15, "unit": "ชิ้น", "location": "C-14", "unitPrice": 28},
    {"sku": "022010-0044", "mnsPartNo": "022010-0044", "partNo": "LED-T8-18W", "description": "LED Tube T8 18W 6500K, 1200mm", "currentStock": 10, "minStock": 20, "unit": "ชิ้น", "location": "D-04", "unitPrice": 95},
    {"sku": "022010-0051", "mnsPartNo": "022010-0051", "partNo": "LED-DOWN-15W", "description": "โคมไฟดาวน์ไลท์ LED 15W 4000K", "currentStock": 32, "minStock": 12, "unit": "ชุด", "location": "D-05", "unitPrice": 185},
    {"sku": "022020-0012", "mnsPartNo": "022020-0012", "partNo": "SWITCH-1WAY", "description": "สวิตช์ 1 ทาง 16A สีขาว", "currentStock": 18, "minStock": 10, "unit": "ชุด", "location": "D-08", "unitPrice": 65},
    {"sku": "031010-0088", "mnsPartNo": "031010-0088", "partNo": "LAMINATE-12MM", "description": "ไม้พื้นลามิเนต 12 มม. สีโอ๊ค", "currentStock": 0, "minStock": 20, "unit": "แผ่น", "location": "E-01", "unitPrice": 420},
    {"sku": "031010-0091", "mnsPartNo": "031010-0091", "partNo": "SKIRTING-MDF", "description": "ไม้บัว MDF ปิดผิว 8 ซม.", "currentStock": 48, "minStock": 12, "unit": "เส้น", "location": "E-02", "unitPrice": 95},
    {"sku": "050010-0001", "mnsPartNo": "050010-0001", "partNo": "FUSE-5A", "description": "Glass Fuse 5A 250V 5x20mm", "currentStock": 120, "minStock": 40, "unit": "ชิ้น", "location": "B-12", "unitPrice": 6},
    {"sku": "050010-0008", "mnsPartNo": "050010-0008", "partNo": "WAGO-221-412", "description": "Compact Splicing Connector 2-conductor", "currentStock": 0, "minStock": 25, "unit": "ชิ้น", "location": "B-18", "unitPrice": 18},
    {"sku": "011010-0020", "mnsPartNo": "011010-0020", "partNo": "SHEET-GI-1.2", "description": "แผ่นเหล็กชุบสังกะสี 1.2 มม. 4×8 ฟุต", "currentStock": 0, "minStock": 10, "unit": "แผ่น", "location": "F-01", "unitPrice": 1450},
    {"sku": "011010-0034", "mnsPartNo": "011010-0034", "partNo": "ANGLE-L50", "description": "เหล็กฉาก L50×50×5 มม. ยาว 6 ม.", "currentStock": 0, "minStock": 8, "unit": "เส้น", "location": "F-02", "unitPrice": 380},
    {"sku": "012010-0011", "mnsPartNo": "012010-0011", "partNo": "GLASS-TEMP-10", "description": "กระจกเทมเปอร์ 10 มม. 1200×2400", "currentStock": 4, "minStock": 6, "unit": "แผ่น", "location": "G-01", "unitPrice": 2850},
]

JOB_EQUIPMENT = [
    {"id": 1, "jobId": "JOB-2026-0142", "mnsPartNo": "007010-0003", "partNo": "FDLL4148", "description": "Diode High Conductance 100V/200mA, SOD-80", "qty": 300, "storeQty": 98, "neededDate": "2026-03-19", "unitPrice": 3, "status": "ordered", "trackStatus": "po_issued", "unit": "ชิ้น"},
    {"id": 2, "jobId": "JOB-2026-0142", "mnsPartNo": "033010-0012", "partNo": "LTV-817S-TA1-C", "description": "Photocoupler Transistor Output 1 Channel", "qty": 200, "storeQty": 200, "neededDate": "2026-03-19", "unitPrice": 12, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 3, "jobId": "JOB-2026-0142", "mnsPartNo": "013010-0006", "partNo": "CD4081BM96", "description": "Quad 2 Input AND Gates", "qty": 40, "storeQty": 40, "neededDate": "2026-03-19", "unitPrice": 18, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 4, "jobId": "JOB-2026-0142", "mnsPartNo": "019011-0021", "partNo": "EK500V-2P", "description": "Screw Terminal Block 2Pins, Pitch 5.00mm", "qty": 200, "storeQty": 60, "neededDate": "2026-03-19", "unitPrice": 9, "status": "ordered", "trackStatus": "po_issued", "unit": "ชิ้น"},
    {"id": 5, "jobId": "JOB-2026-0142", "mnsPartNo": "008011-0038", "partNo": "L7808CV-DG", "description": "Positive Voltage Regulators 8V/1.5A", "qty": 12, "storeQty": 5, "neededDate": "2026-03-19", "unitPrice": 25, "status": "ordered", "trackStatus": "pending_quote", "unit": "ชิ้น"},
    {"id": 6, "jobId": "JOB-2026-0142", "mnsPartNo": "002000-0071", "partNo": "CD4070BE DIP 14", "description": "Quad 2-Input XOR Logic Gate, 14-Pin PDIP", "qty": 12, "storeQty": 7, "neededDate": "2026-03-19", "unitPrice": 16, "status": "ordered", "trackStatus": "po_issued", "unit": "ชิ้น"},
    {"id": 7, "jobId": "JOB-2026-0142", "mnsPartNo": "013010-0007", "partNo": "CD4001BE", "description": "CMOS NOR Gate, Quad 2 Input", "qty": 12, "storeQty": 12, "neededDate": "2026-03-19", "unitPrice": 14, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 8, "jobId": "JOB-2026-0142", "mnsPartNo": "013010-0008", "partNo": "CD4081BE", "description": "Quad 2 Input AND Gates", "qty": 12, "storeQty": 12, "neededDate": "2026-03-19", "unitPrice": 15, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 9, "jobId": "JOB-2026-0142", "mnsPartNo": "008010-0022", "partNo": "MMBT5551", "description": "Transistor NPN 160V/600mA", "qty": 60, "storeQty": 60, "neededDate": "2026-03-19", "unitPrice": 4, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 10, "jobId": "JOB-2026-0142", "mnsPartNo": "013010-0009", "partNo": "NE555N", "description": "CMOS General Purpose Timer", "qty": 24, "storeQty": 24, "neededDate": "2026-03-19", "unitPrice": 8, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 11, "jobId": "JOB-2026-0142", "mnsPartNo": "018010-0002", "partNo": "HL-PC-3216U51GC", "description": "Chip LED Green 600-800mcd", "qty": 4000, "storeQty": 4000, "neededDate": "2026-03-19", "unitPrice": 1, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชิ้น"},
    {"id": 12, "jobId": "JOB-2026-0138", "mnsPartNo": "041010-0101", "partNo": "MCB-32A-3P", "description": "Circuit Breaker 32A 3P, IEC 60898", "qty": 8, "storeQty": 2, "neededDate": "2026-08-20", "unitPrice": 1850, "status": "pending_order", "trackStatus": "pending_quote", "unit": "ชุด"},
    {"id": 13, "jobId": "JOB-2026-0138", "mnsPartNo": "041010-0108", "partNo": "CABLE-NYY-4x16", "description": "Power Cable NYY 4x16 sq.mm. 100m/roll", "qty": 6, "storeQty": 0, "neededDate": "2026-08-22", "unitPrice": 4200, "status": "ordered", "trackStatus": "po_issued", "unit": "ม้วน"},
    {"id": 14, "jobId": "JOB-2026-0138", "mnsPartNo": "041010-0112", "partNo": "BUSBAR-CU-30x5", "description": "Copper Busbar 30×5 mm, 2 m", "qty": 10, "storeQty": 0, "neededDate": "2026-08-22", "unitPrice": 680, "status": "ordered", "trackStatus": "po_issued", "unit": "เส้น"},
    {"id": 15, "jobId": "JOB-2026-0138", "mnsPartNo": "041010-0094", "partNo": "MCB-16A-1P", "description": "Miniature Circuit Breaker 16A 1P", "qty": 24, "storeQty": 24, "neededDate": "2026-08-18", "unitPrice": 220, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชุด"},
    {"id": 16, "jobId": "JOB-2026-0138", "mnsPartNo": "041020-0033", "partNo": "CONDUIT-PVC-25", "description": "ท่อร้อยสาย PVC 25 มม. × 4 ม.", "qty": 80, "storeQty": 80, "neededDate": "2026-08-19", "unitPrice": 45, "status": "received", "trackStatus": "delivered_pending_payment", "unit": "เส้น"},
    {"id": 17, "jobId": "JOB-2026-0138", "mnsPartNo": "041020-0041", "partNo": "GLAND-PG21", "description": "Cable Gland PG21, Nickel Plated", "qty": 40, "storeQty": 0, "neededDate": "2026-08-25", "unitPrice": 28, "status": "pending_order", "trackStatus": "pending_quote", "unit": "ชิ้น"},
    {"id": 18, "jobId": "JOB-2026-0129", "mnsPartNo": "022010-0044", "partNo": "LED-T8-18W", "description": "LED Tube T8 18W 6500K, 1200mm", "qty": 40, "storeQty": 10, "neededDate": "2026-08-25", "unitPrice": 95, "status": "pending_order", "trackStatus": "pending_quote", "unit": "หลอด"},
    {"id": 19, "jobId": "JOB-2026-0129", "mnsPartNo": "031010-0088", "partNo": "LAMINATE-12MM", "description": "ไม้พื้นลามิเนต 12 มม. สีโอ๊ค", "qty": 80, "storeQty": 0, "neededDate": "2026-08-26", "unitPrice": 420, "status": "pending_order", "trackStatus": "pending_quote", "unit": "แผ่น"},
    {"id": 20, "jobId": "JOB-2026-0129", "mnsPartNo": "031010-0091", "partNo": "SKIRTING-MDF", "description": "ไม้บัว MDF ปิดผิว 8 ซม.", "qty": 48, "storeQty": 48, "neededDate": "2026-08-20", "unitPrice": 95, "status": "issued", "trackStatus": "ready_for_use", "unit": "เส้น"},
    {"id": 21, "jobId": "JOB-2026-0129", "mnsPartNo": "022010-0051", "partNo": "LED-DOWN-15W", "description": "โคมไฟดาวน์ไลท์ LED 15W 4000K", "qty": 32, "storeQty": 32, "neededDate": "2026-08-21", "unitPrice": 185, "status": "received", "trackStatus": "delivered_pending_payment", "unit": "ชุด"},
    {"id": 22, "jobId": "JOB-2026-0129", "mnsPartNo": "022020-0012", "partNo": "SWITCH-1WAY", "description": "สวิตช์ 1 ทาง 16A สีขาว", "qty": 18, "storeQty": 18, "neededDate": "2026-08-18", "unitPrice": 65, "status": "issued", "trackStatus": "ready_for_use", "unit": "ชุด"},
    {"id": 23, "jobId": "JOB-2026-0135", "mnsPartNo": "022010-0044", "partNo": "LED-T8-18W", "description": "LED Tube T8 18W 6500K, 1200mm", "qty": 40, "storeQty": 0, "neededDate": "2026-08-21", "unitPrice": 95, "status": "ordered", "trackStatus": "po_issued", "unit": "หลอด"},
    {"id": 24, "jobId": "JOB-2026-0121", "mnsPartNo": "012010-0011", "partNo": "GLASS-TEMP-10", "description": "กระจกเทมเปอร์ 10 มม. 1200×2400", "qty": 24, "storeQty": 4, "neededDate": "2026-08-19", "unitPrice": 2850, "status": "ordered", "trackStatus": "po_issued", "unit": "แผ่น"},
    {"id": 25, "jobId": "JOB-2026-0118", "mnsPartNo": "011010-0020", "partNo": "SHEET-GI-1.2", "description": "แผ่นเหล็กชุบสังกะสี 1.2 มม. 4×8 ฟุต", "qty": 36, "storeQty": 0, "neededDate": "2026-08-28", "unitPrice": 1450, "status": "pending_order", "trackStatus": "pending_quote", "unit": "แผ่น"},
    {"id": 26, "jobId": "JOB-2026-0118", "mnsPartNo": "011010-0034", "partNo": "ANGLE-L50", "description": "เหล็กฉาก L50×50×5 มม. ยาว 6 ม.", "qty": 20, "storeQty": 0, "neededDate": "2026-08-28", "unitPrice": 380, "status": "pending_order", "trackStatus": "pending_quote", "unit": "เส้น"},
]

PENDING_PURCHASES = [
    {"id": 12, "jobId": "JOB-2026-0138", "mnsPartNo": "041010-0101", "partNo": "MCB-32A-3P", "description": "Circuit Breaker 32A 3P, IEC 60898", "qty": 6, "unitPrice": 1850, "status": "pending"},
    {"id": 13, "jobId": "JOB-2026-0138", "mnsPartNo": "041010-0108", "partNo": "CABLE-NYY-4x16", "description": "Power Cable NYY 4x16 sq.mm. 100m/roll", "qty": 6, "unitPrice": 4200, "status": "pending"},
    {"id": 14, "jobId": "JOB-2026-0129", "mnsPartNo": "022010-0044", "partNo": "LED-T8-18W", "description": "LED Tube T8 18W 6500K, 1200mm", "qty": 30, "unitPrice": 95, "status": "pending"},
    {"id": 15, "jobId": "JOB-2026-0138", "mnsPartNo": "041020-0041", "partNo": "GLAND-PG21", "description": "Cable Gland PG21, Nickel Plated", "qty": 40, "unitPrice": 28, "status": "pending"},
    {"id": 16, "jobId": "JOB-2026-0129", "mnsPartNo": "031010-0088", "partNo": "LAMINATE-12MM", "description": "ไม้พื้นลามิเนต 12 มม. สีโอ๊ค", "qty": 80, "unitPrice": 420, "status": "pending"},
    {"id": 17, "jobId": "JOB-2026-0118", "mnsPartNo": "011010-0020", "partNo": "SHEET-GI-1.2", "description": "แผ่นเหล็กชุบสังกะสี 1.2 มม. 4×8 ฟุต", "qty": 36, "unitPrice": 1450, "status": "pending"},
    {"id": 18, "jobId": "JOB-2026-0118", "mnsPartNo": "011010-0034", "partNo": "ANGLE-L50", "description": "เหล็กฉาก L50×50×5 มม. ยาว 6 ม.", "qty": 20, "unitPrice": 380, "status": "pending"},
    {"id": 19, "jobId": "JOB-2026-0142", "mnsPartNo": "008011-0038", "partNo": "L7808CV-DG", "description": "Positive Voltage Regulators 8V/1.5A", "qty": 7, "unitPrice": 25, "status": "pending"},
]

PURCHASE_ORDERS = [
    {
        "poNumber": "PO-2608-0012",
        "vendorId": "VEN-001",
        "vendorName": "บจก. สยามสตีล",
        "amount": 900,
        "stage": "draft",
        "note": "รายการอิเล็กทรอนิกส์หลายจ๊อบ",
        "createdAt": "2026-08-10",
        "lines": [
            {"mnsPartNo": "007010-0003", "partNo": "FDLL4148", "description": "Diode High Conductance 100V/200mA, SOD-80", "qty": 300, "unitPrice": 3, "jobId": "JOB-2026-0142"},
        ],
    },
    {
        "poNumber": "PO-2608-0001",
        "vendorId": "VEN-006",
        "vendorName": "บจก. เมทัลเวิร์ค ไทย",
        "amount": 14800,
        "stage": "draft",
        "createdAt": "2026-08-02",
        "lines": [
            {"mnsPartNo": "041010-0101", "partNo": "MCB-32A-3P", "description": "Circuit Breaker 32A 3P", "qty": 8, "unitPrice": 1850, "jobId": "JOB-2026-0138"},
        ],
    },
    {
        "poNumber": "PO-2608-0009",
        "vendorId": "VEN-002",
        "vendorName": "หจก. นครปูนซีเมนต์",
        "amount": 16800,
        "stage": "pending_approval",
        "createdAt": "2026-08-08",
        "lines": [
            {"mnsPartNo": "041010-0108", "partNo": "CABLE-NYY-4x16", "description": "Power Cable NYY 4x16", "qty": 4, "unitPrice": 4200, "jobId": "JOB-2026-0138"},
        ],
    },
    {
        "poNumber": "PO-2608-0007",
        "vendorId": "VEN-003",
        "vendorName": "บจก. ไทยไลท์ติ้ง",
        "amount": 3800,
        "stage": "pending_approval",
        "createdAt": "2026-08-07",
        "lines": [
            {"mnsPartNo": "022010-0044", "partNo": "LED-T8-18W", "description": "LED Tube T8 18W", "qty": 40, "unitPrice": 95, "jobId": "JOB-2026-0135"},
        ],
    },
    {
        "poNumber": "PO-2608-0004",
        "vendorId": "VEN-004",
        "vendorName": "บจก. กรีนวู้ด ซัพพลาย",
        "amount": 1900,
        "stage": "sent_to_vendor",
        "createdAt": "2026-08-04",
        "lines": [
            {"mnsPartNo": "022010-0044", "partNo": "LED-T8-18W", "description": "LED Tube T8 18W", "qty": 20, "unitPrice": 95, "jobId": "JOB-2026-0129"},
        ],
    },
    {
        "poNumber": "PO-2608-0003",
        "vendorId": "VEN-005",
        "vendorName": "บจก. เอเชียกลาส",
        "amount": 3600,
        "stage": "sent_to_vendor",
        "createdAt": "2026-08-03",
        "lines": [
            {"mnsPartNo": "050010-0008", "partNo": "WAGO-221-412", "description": "Compact Splicing Connector", "qty": 200, "unitPrice": 18, "jobId": "JOB-2026-0121"},
        ],
    },
]

PENDING_PAYMENTS = [
    {"poNumber": "PO-2607-0041", "vendorName": "บจก. สยามสตีล", "amount": 245000, "dueDate": "2026-08-14", "jobId": "JOB-2026-0142"},
    {"poNumber": "PO-2607-0038", "vendorName": "หจก. นครปูนซีเมนต์", "amount": 189500, "dueDate": "2026-08-17", "jobId": "JOB-2026-0138"},
    {"poNumber": "PO-2607-0033", "vendorName": "บจก. ไทยไลท์ติ้ง", "amount": 76400, "dueDate": "2026-08-20", "jobId": "JOB-2026-0135"},
    {"poNumber": "PO-2607-0029", "vendorName": "บจก. เอเชียกลาส", "amount": 412000, "dueDate": "2026-08-25", "jobId": "JOB-2026-0121"},
    {"poNumber": "PO-2607-0022", "vendorName": "บจก. กรีนวู้ด ซัพพลาย", "amount": 53800, "dueDate": "2026-09-02", "jobId": "JOB-2026-0129"},
]

PENDING_DELIVERIES = [
    {"id": "DEL-001", "poNumber": "PO-2608-0004", "itemDetails": "ไม้พื้นลามิเนต 12 มม. × 80 แผ่น", "expectedDate": "2026-08-18", "progress": "in_transit", "jobId": "JOB-2026-0129"},
    {"id": "DEL-002", "poNumber": "PO-2608-0003", "itemDetails": "กระจกเทมเปอร์ 10 มม. × 24 แผ่น", "expectedDate": "2026-08-19", "progress": "partial", "jobId": "JOB-2026-0121"},
    {"id": "DEL-003", "poNumber": "PO-2608-0007", "itemDetails": "โคมไฟดาวน์ไลท์ LED 15W × 120 ชุด", "expectedDate": "2026-08-21", "progress": "ready", "jobId": "JOB-2026-0135"},
    {"id": "DEL-004", "poNumber": "PO-2607-0041", "itemDetails": "เหล็กเส้น SD40 12 มม. × 2.4 ตัน", "expectedDate": "2026-08-22", "progress": "in_transit", "jobId": "JOB-2026-0142"},
]

RESERVATIONS = [
    {"id": "RSV-001", "sku": "013010-0006", "jobId": "JOB-2026-0142", "qty": 8, "createdBy": "USR-002", "createdAt": "2026-08-15"},
    {"id": "RSV-002", "sku": "041010-0094", "jobId": "JOB-2026-0138", "qty": 4, "createdBy": "USR-002", "createdAt": "2026-08-16"},
]

VENDOR_QUOTES = [
    {"pendingId": 12, "vendorId": "VEN-001", "unitPrice": 1850, "leadDays": 5},
    {"pendingId": 12, "vendorId": "VEN-006", "unitPrice": 1790, "leadDays": 7},
    {"pendingId": 12, "vendorId": "VEN-007", "unitPrice": 1920, "leadDays": 4},
    {"pendingId": 13, "vendorId": "VEN-001", "unitPrice": 4200, "leadDays": 10},
    {"pendingId": 13, "vendorId": "VEN-002", "unitPrice": 4050, "leadDays": 12},
    {"pendingId": 13, "vendorId": "VEN-006", "unitPrice": 4300, "leadDays": 8},
    {"pendingId": 14, "vendorId": "VEN-003", "unitPrice": 95, "leadDays": 3},
    {"pendingId": 14, "vendorId": "VEN-004", "unitPrice": 89, "leadDays": 5},
    {"pendingId": 14, "vendorId": "VEN-007", "unitPrice": 102, "leadDays": 2},
]

CUSTOMERS = [
    {"id": "CUS-001", "code": "C-2026-001", "name": "บจก. บางกอก อิเล็กทริก", "contactPerson": "คุณสุรชัย พานิช", "phone": "02-880-1100", "email": "po@bangkokelectric.example", "address": "120 ถ.พระราม 3 เขตบางคอแหลม กรุงเทพฯ 10120", "taxId": "0105556112233", "creditTermDays": 30, "active": True},
    {"id": "CUS-002", "code": "C-2026-002", "name": "หจก. ชลบุรี ออโตเมชั่น", "contactPerson": "คุณมณีวรรณ วงศ์ทอง", "phone": "038-441-2200", "email": "buy@chonburiauto.example", "address": "9/4 นิคมอุตสาหกรรมแหลมฉบัง ศรีราชา ชลบุรี 20230", "taxId": "0205558004412", "creditTermDays": 45, "active": True},
    {"id": "CUS-003", "code": "C-2026-003", "name": "บจก. เชียงใหม่ สมาร์ทโฮม", "contactPerson": "คุณธีระ แสงดาว", "phone": "053-210-8899", "email": "sales@cnxsmart.example", "address": "88 ถ.ห้วยแก้ว อ.เมือง เชียงใหม่ 50200", "taxId": "0505559007781", "creditTermDays": 15, "active": True},
    {"id": "CUS-004", "code": "C-2026-004", "name": "บจก. ปทุมธานี ไลท์ติ้ง โปร", "contactPerson": "คุณอรอุมา ไฟสว่าง", "phone": "02-159-3344", "email": "order@ptllighting.example", "address": "21 ถ.รังสิต-นครนายก คลองหลวง ปทุมธานี 12120", "taxId": "0135552201098", "creditTermDays": 30, "active": False},
    {"id": "CUS-005", "code": "C-2026-005", "name": "บจก. นครสวรรค์ อินดัสเทรียล", "contactPerson": "คุณกิตติพงษ์ ตั้งตรง", "phone": "056-220-4411", "email": "purchase@nsnindustrial.example", "address": "45 ถ.พหลโยธิน อ.เมือง นครสวรรค์ 60000", "taxId": "0605553302214", "creditTermDays": 30, "active": True},
    {"id": "CUS-006", "code": "C-2026-006", "name": "หจก. ภูเก็ต โฮเต็ล ซัพพลาย", "contactPerson": "คุณนันท์นภัส ทะเลใส", "phone": "076-330-7788", "email": "order@phukethotel.example", "address": "12/9 ถ.เฉลิมพระเกียรติ อ.เมือง ภูเก็ต 83000", "taxId": "0835551109902", "creditTermDays": 21, "active": True},
]

SALES_STOCK = [
    {"sku": "022010-0044", "sellPrice": 135, "minSellQty": 10, "note": "หลอดไฟโครงการบ้าน/โรงแรม"},
    {"sku": "041010-0101", "sellPrice": 2350, "minSellQty": 1, "note": "เบรกเกอร์ขายให้ลูกค้าอาคาร"},
    {"sku": "050010-0001", "sellPrice": 12, "minSellQty": 20, "note": "ฟิวส์สำรอง"},
    {"sku": "033010-0012", "sellPrice": 18, "minSellQty": 50, "note": "โฟโต้คัปเปลอร์"},
    {"sku": "013010-0006", "sellPrice": 28, "minSellQty": 10, "note": ""},
]


def stock_status(item: dict) -> str:
    if item["currentStock"] <= 0:
        return "out_of_stock"
    if item["currentStock"] <= item["minStock"]:
        return "low_stock"
    return "in_stock"


def write_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def write_csv(path: Path, rows: list[dict], fieldnames: list[str] | None = None) -> None:
    if not rows:
        path.write_text("", encoding="utf-8-sig")
        return
    fields = fieldnames or list(rows[0].keys())
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def flatten_po_lines() -> list[dict]:
    lines = []
    for po in PURCHASE_ORDERS:
        for line in po["lines"]:
            lines.append(
                {
                    "poNumber": po["poNumber"],
                    "vendorId": po["vendorId"],
                    "vendorName": po["vendorName"],
                    "stage": po["stage"],
                    **line,
                }
            )
    return lines


def inventory_with_status() -> list[dict]:
    return [{**item, "stockStatus": stock_status(item)} for item in INVENTORY]


def kpis() -> dict:
    inv = inventory_with_status()
    return {
        "vendorJobsReady": sum(1 for job in JOBS if job["status"] == "ready_for_po"),
        "posInProcess": sum(1 for po in PURCHASE_ORDERS if po["stage"] != "delivered"),
        "pendingPaymentTotal": sum(item["amount"] for item in PENDING_PAYMENTS),
        "pendingDeliveriesCount": len(PENDING_DELIVERIES),
        "orderedEquipmentCount": sum(1 for item in JOB_EQUIPMENT if item["status"] == "ordered"),
        "lowStockCount": sum(1 for item in inv if item["stockStatus"] in ("low_stock", "out_of_stock")),
        "pendingPurchaseCount": sum(1 for item in PENDING_PURCHASES if item["status"] == "pending"),
        "totalJobs": len(JOBS),
        "totalVendors": len(VENDORS),
        "totalInventorySku": len(INVENTORY),
        "totalJobEquipment": len(JOB_EQUIPMENT),
    }


def main() -> None:
    JSON_DIR.mkdir(parents=True, exist_ok=True)
    CSV_DIR.mkdir(parents=True, exist_ok=True)

    inv = inventory_with_status()
    seed = {
        "version": "1.0.0",
        "generatedFor": "procurement-dashboard",
        "settings": SETTINGS,
        "statusDictionary": STATUS_DICTIONARY,
        "workGroups": WORK_GROUPS,
        "employees": EMPLOYEES,
        "customers": CUSTOMERS,
        "salesStock": SALES_STOCK,
        "vendors": VENDORS,
        "jobs": JOBS,
        "inventory": inv,
        "jobEquipment": JOB_EQUIPMENT,
        "pendingPurchases": PENDING_PURCHASES,
        "purchaseOrders": PURCHASE_ORDERS,
        "pendingPayments": PENDING_PAYMENTS,
        "pendingDeliveries": PENDING_DELIVERIES,
        "reservations": RESERVATIONS,
        "vendorQuotes": VENDOR_QUOTES,
        "kpis": kpis(),
    }

    write_json(ROOT / "seed.json", seed)
    write_json(JSON_DIR / "settings.json", SETTINGS)
    write_json(JSON_DIR / "status-dictionary.json", STATUS_DICTIONARY)
    write_json(JSON_DIR / "work-groups.json", WORK_GROUPS)
    write_json(JSON_DIR / "employees.json", EMPLOYEES)
    write_json(JSON_DIR / "customers.json", CUSTOMERS)
    write_json(JSON_DIR / "sales-stock.json", SALES_STOCK)
    write_json(JSON_DIR / "vendors.json", VENDORS)
    write_json(JSON_DIR / "jobs.json", JOBS)
    write_json(JSON_DIR / "inventory.json", inv)
    write_json(JSON_DIR / "job-equipment.json", JOB_EQUIPMENT)
    write_json(JSON_DIR / "pending-purchases.json", PENDING_PURCHASES)
    write_json(JSON_DIR / "purchase-orders.json", PURCHASE_ORDERS)
    write_json(JSON_DIR / "pending-payments.json", PENDING_PAYMENTS)
    write_json(JSON_DIR / "pending-deliveries.json", PENDING_DELIVERIES)
    write_json(JSON_DIR / "reservations.json", RESERVATIONS)
    write_json(JSON_DIR / "vendor-quotes.json", VENDOR_QUOTES)
    write_json(JSON_DIR / "kpis.json", kpis())

    write_csv(
        CSV_DIR / "work-groups.csv",
        [
            {
                "id": group["id"],
                "labelTh": group["labelTh"],
                "labelEn": group["labelEn"],
                "description": group["description"],
                "modules": "|".join(group["modules"]),
            }
            for group in WORK_GROUPS
        ],
    )
    write_csv(CSV_DIR / "employees.csv", [{k: ("|".join(v) if isinstance(v, list) else v) for k, v in u.items()} for u in EMPLOYEES])
    write_csv(CSV_DIR / "customers.csv", CUSTOMERS)
    write_csv(CSV_DIR / "sales-stock.csv", SALES_STOCK)
    write_csv(CSV_DIR / "vendors.csv", VENDORS)
    write_csv(CSV_DIR / "jobs.csv", JOBS)
    write_csv(CSV_DIR / "inventory.csv", inv)
    write_csv(CSV_DIR / "job-equipment.csv", JOB_EQUIPMENT)
    write_csv(CSV_DIR / "pending-purchases.csv", PENDING_PURCHASES)
    write_csv(CSV_DIR / "purchase-order-lines.csv", flatten_po_lines())
    write_csv(CSV_DIR / "pending-payments.csv", PENDING_PAYMENTS)
    write_csv(CSV_DIR / "pending-deliveries.csv", PENDING_DELIVERIES)
    write_csv(CSV_DIR / "reservations.csv", RESERVATIONS)
    write_csv(CSV_DIR / "vendor-quotes.csv", VENDOR_QUOTES)

    readme = """# ข้อมูลสำหรับรันระบบจัดซื้อ (Procurement Seed Data)

โฟลเดอร์นี้เป็นชุดข้อมูลเริ่มต้นครบชุด สำหรับ mock / นำเข้าระบบ

## กลุ่มงาน
| กลุ่ม | หน้าที่ |
|---|---|
| กลุ่มจัดซื้อ (Purchasing) | รอจัดซื้อ, ร้านค้า, PO, จ๊อบ |
| กลุ่มบัญชี (Accounting) | การชำระเงิน, PO, รอรับของ |
| กลุ่มผลิต (Production) | จ๊อบ, คลัง, เบิกของ, ติดตามอุปกรณ์ |
| กลุ่มขาย (Sales) | ฐานข้อมูลลูกค้า, สต็อกสำหรับขาย |

## บัญชีทดลอง
| อีเมล | รหัสผ่าน | บทบาท | แผนก |
|---|---|---|---|
| admin@mns.local | admin123 | Admin | ทุกแผนก |
| purchase.mgr@mns.local | mgr123 | หัวหน้าจัดซื้อ | จัดซื้อ |
| purchase@mns.local | purchase123 | พนักงานจัดซื้อ | จัดซื้อ |
| account.mgr@mns.local | mgr123 | หัวหน้าบัญชี | บัญชี |
| account@mns.local | account123 | พนักงานบัญชี | บัญชี |
| site@mns.local | site123 | หัวหน้าผลิต | ผลิต |
| staff@mns.local | staff123 | พนักงานคลัง | ผลิต |
| sales.mgr@mns.local | mgr123 | หัวหน้าขาย | ขาย |
| sales@mns.local | sales123 | พนักงานขาย | ขาย |

## ไฟล์หลัก
- `seed.json` — ข้อมูลทั้งหมดในไฟล์เดียว (ใช้โหลดระบบ)
- `json/` — แยกตามตาราง
- `csv/` — เปิดด้วย Excel ได้ทันที (UTF-8 BOM)

## ตารางที่มี
- ผู้ใช้, ร้านค้า, จ๊อบ
- คลังสินค้า, อะไหล่ตามจ๊อบ
- รายการรอจัดซื้อ, ใบ PO, ใบเสนอราคา 3 ร้าน
- ค้างชำระ, รอรับของ, การจองสต็อก
- พจนานุกรมสถานะ และค่าตั้งต้นบริษัท

## จำนวนแถว
ดูสรุปใน `json/kpis.json` หรือคีย์ `kpis` ใน `seed.json`
"""
    (ROOT / "README.md").write_text(readme, encoding="utf-8")
    print(f"Wrote seed data to {ROOT}")
    print(json.dumps(kpis(), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
