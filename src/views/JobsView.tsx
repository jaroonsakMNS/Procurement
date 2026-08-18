import JobOrderedEquipment from '../components/dashboard/JobOrderedEquipment'
import VendorAssignedJobs from '../components/dashboard/VendorAssignedJobs'
import JobDetails from '../components/jobs/JobDetails'
import { generateJobId, matchesQuery } from '../lib/format'
import type { DraftPart } from '../lib/parseJobExcel'
import type { JobEquipmentItem, VendorJob } from '../types/procurement'
import { useMemo } from 'react'

interface JobsViewProps {
  jobs: VendorJob[]
  equipment: JobEquipmentItem[]
  selectedJobId: string | null
  poNotice: string | null
  searchQuery: string
  onCreateJob: (job: VendorJob, parts: DraftPart[]) => boolean
  onOpenJob: (job: VendorJob) => void
  onCloseJob: () => void
  onSavePart: (part: Omit<JobEquipmentItem, 'id'> & { id?: number }) => void
  onDeletePart: (partId: number) => void
  onRequestPurchase: (partIds: number[]) => void
}

export default function JobsView({
  jobs,
  equipment,
  selectedJobId,
  poNotice,
  searchQuery,
  onCreateJob,
  onOpenJob,
  onCloseJob,
  onSavePart,
  onDeletePart,
  onRequestPurchase,
}: JobsViewProps) {
  const selectedJob = jobs.find((j) => j.jobId === selectedJobId) ?? null
  const selectedJobParts = equipment.filter((e) => e.jobId === selectedJobId)

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        matchesQuery(searchQuery, [job.jobId, job.projectName, job.vendorName, job.status]),
      ),
    [jobs, searchQuery],
  )

  const filteredEquipment = useMemo(
    () =>
      equipment.filter(
        (item) =>
          (item.status === 'ordered' || item.status === 'issued') &&
          matchesQuery(searchQuery, [item.jobId, item.mnsPartNo, item.partNo, item.description, item.status]),
      ),
    [equipment, searchQuery],
  )

  return (
    <div className="space-y-6">
      <VendorAssignedJobs
        jobs={filteredJobs}
        suggestedJobId={generateJobId(jobs)}
        existingJobIds={jobs.map((j) => j.jobId)}
        onCreateJob={onCreateJob}
        onOpenJob={(job) => {
          onOpenJob(job)
        }}
      />

      <JobOrderedEquipment items={filteredEquipment} />

      {selectedJob ? (
        <JobDetails
          job={selectedJob}
          parts={selectedJobParts}
          notice={poNotice}
          onClose={onCloseJob}
          onSavePart={onSavePart}
          onDeletePart={onDeletePart}
          onRequestPurchase={onRequestPurchase}
        />
      ) : null}
    </div>
  )
}
