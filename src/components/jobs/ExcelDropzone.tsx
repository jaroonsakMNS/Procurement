import { FileSpreadsheet, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { isSpreadsheetFile } from '../../lib/parseJobExcel'

interface ExcelDropzoneProps {
  fileName?: string
  importMessage?: string
  error?: string
  onFile: (file: File) => void
  onClear: () => void
  onInvalidType?: () => void
}

export default function ExcelDropzone({
  fileName,
  importMessage,
  error,
  onFile,
  onClear,
  onInvalidType,
}: ExcelDropzoneProps) {
  const [dragging, setDragging] = useState(false)

  function acceptFile(file?: File) {
    if (!file) {
      return
    }

    if (!isSpreadsheetFile(file)) {
      onInvalidType?.()
      return
    }

    onFile(file)
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-semibold text-slate-900">แนบไฟล์ Excel / Import อะไหล่</h4>
      <p className="mt-0.5 text-xs text-slate-500">
        รองรับ .xlsx, .xls, .csv — แนบเป็นเอกสารอ้างอิง และดึงรายการอะไหล่เข้าตารางอัตโนมัติ
      </p>

      <label
        className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          dragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white hover:border-teal-400'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          acceptFile(event.dataTransfer.files[0])
        }}
      >
        <Upload className="h-8 w-8 text-teal-600" />
        <p className="mt-2 text-sm font-medium text-slate-700">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
        <p className="mt-1 text-xs text-slate-400">Excel File Attachment & Import</p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          className="sr-only"
          onChange={(event) => {
            acceptFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </label>

      {fileName ? (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-slate-700">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-teal-600" />
            <span className="truncate">{fileName}</span>
          </span>
          <button
            type="button"
            onClick={onClear}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="ลบไฟล์แนบ"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {importMessage ? <p className="mt-2 text-xs text-teal-700">{importMessage}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </section>
  )
}
