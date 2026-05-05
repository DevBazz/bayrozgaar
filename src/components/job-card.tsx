import { Link } from '@tanstack/react-router'
import { MapPinIcon, BriefcaseIcon, MonitorIcon } from 'lucide-react'
import type { getAllJobFn } from '#/utils/job/job.functions'

type Job = Awaited<ReturnType<typeof getAllJobFn>>[number]

interface JobCardProps {
	job: Job
}

export default function JobCard({ job }: JobCardProps) {
	return (
		<Link
			to="/jobs/$jobId"
			params={{ jobId: job.id }}
			className="flex flex-col gap-2 py-5 hover:bg-accent/40 px-3 -mx-3 transition-colors"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h3 className="font-semibold text-foreground">{job.title}</h3>
					<p className="text-sm text-muted-foreground">{job.user.companyName}</p>
				</div>
				<span className="shrink-0 text-sm font-semibold text-primary">
					Rs {job.salary.toLocaleString()}/month
				</span>
			</div>

			<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
				<span className="flex items-center gap-1">
					<MapPinIcon className="h-3 w-3" />
					{job.location}
				</span>
				<span className="flex items-center gap-1">
					<BriefcaseIcon className="h-3 w-3" />
					{job.type}
				</span>
				<span className="flex items-center gap-1">
					<MonitorIcon className="h-3 w-3" />
					{job.jobMode}
				</span>
			</div>
		</Link>
	)
}
