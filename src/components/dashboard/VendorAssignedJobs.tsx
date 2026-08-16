import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DraftPart } from '../../lib/parseJobExcel'
import type { JobStatus, VendorJob } from '../../types/procurement'
import JobFormModal from '../jobs/JobFormModal'
import JobSearch from '../jobs/JobSearch'
import StatusBadge from './StatusBadge'

interface VendorAssignedJobsProps {
  jobs: VendorJob[]
  suggestedJobId: string
  existingJobIds: string[]
  onOpenJob: (job: VendorJob) => void
  onCreateJob: (job: VendorJob, parts: DraftPart[]) => boolean
}

export default function VendorAssignedJobs({
  jobs,
  suggestedJobId,
  existingJobIds,
  onOpenJob,
  onCreateJob,
}: VendorAssignedJobsProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<JobStatus | 'all'>('all')
  const [vendor, setVendor] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  const vendors = useMemo(
    () => [...new Set(jobs.map((job) => job.vendorName))].sort((a, b) => a.localeCompare(b, 'th')),
    [jobs],
  )

  const filteredJobs = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesSearch =
        !normalized ||
        job.jobId.toLowerCase().includes(normalized) ||
        job.projectName.toLowerCase().includes(normalized)
      const matchesStatus = status === 'all' || job.status === status
      const matchesVendor = vendor === 'all' || job.vendorName === vendor

      return matchesSearch && matchesStatus && matchesVendor
    })
  }, [jobs, query, status, vendor])

  return (
    <section
      id="jobs"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">หาจ๊อบที่มีร้านค้า</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Vendor-Assigned Jobs — ค้นหา กรอง และเปิดรายละเอียดเพื่อจัดการอะไหล่
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          จ๊อบใหม่ (Create Job)
        </button>
      </header>

      <JobSearch
        query={query}
        status={status}
        vendor={vendor}
        vendors={vendors}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onVendorChange={setVendor}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Job ID</th>
              <th className="px-5 py-3 font-medium">ชื่อโครงการ (Project)</th>
              <th className="px-5 py-3 font-medium">ร้านค้า (Vendor)</th>
              <th className="px-5 py-3 font-medium">สถานะ (Status)</th>
              <th className="px-5 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  ไม่พบรายการที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.jobId} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">{job.jobId}</td>
                  <td className="px-5 py-3 text-slate-700">{job.projectName}</td>
                  <td className="px-5 py-3 text-slate-600">{job.vendorName}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenJob(job)}
                      className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-100"
                    >
                      รายละเอียด
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <JobFormModal
        open={formOpen}
        suggestedJobId={suggestedJobId}
        vendors={vendors}
        existingJobIds={existingJobIds}
        onClose={() => setFormOpen(false)}
        onSubmit={(job, parts) => {
          const created = onCreateJob(job, parts)
          if (created) {
            setFormOpen(false)
          }
          return created
        }}
      />
    </section>
  )
}
