import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getRole } from '#/utils/user/users.functions'
import { getJobByEmployerFn } from '#/utils/job/job.functions'
import { getAppliedJobsFn } from '#/utils/application/application.functions'
import {
	MapPinIcon,
	BriefcaseIcon,
	MonitorIcon,
	UsersIcon,
} from 'lucide-react'

const employerJobsQueryOptions = queryOptions({
	queryKey: ['my-jobs', 'employer'],
	queryFn: () => getJobByEmployerFn(),
})

const appliedJobsQueryOptions = queryOptions({
	queryKey: ['my-jobs', 'employee'],
	queryFn: () => getAppliedJobsFn(),
})

export const Route = createFileRoute('/my-jobs')({
	loader: async ({ context: { queryClient } }) => {
		const role = await getRole()
		if (!role) throw redirect({ to: '/sign-in' })

		if (role === 'Employer') {
			await queryClient.ensureQueryData(employerJobsQueryOptions)
		} else {
			await queryClient.ensureQueryData(appliedJobsQueryOptions)
		}

		return { role }
	},
	component: MyJobsPage,
})

const statusColors: Record<string, string> = {
	Pending: 'text-yellow-500',
	Reviewed: 'text-blue-500',
	Accepted: 'text-green-500',
	Rejected: 'text-destructive',
}

function EmployerJobs() {
	const { data: jobs } = useSuspenseQuery(employerJobsQueryOptions)

	return (
		<div className="flex flex-col gap-4">
			{jobs.length === 0 ? (
				<p className="text-sm text-muted-foreground">You haven't posted any jobs yet.</p>
			) : (
				<div className="flex flex-col divide-y divide-border">
					{jobs.map((job) => (
						<Link
							key={job.id}
							to="/jobs/$jobId"
							params={{ jobId: job.id }}
							className="flex items-start justify-between gap-4 py-5 px-3 -mx-3 hover:bg-accent/40 transition-colors"
						>
							<div className="flex flex-col gap-2">
								<h3 className="font-semibold text-foreground">{job.title}</h3>
								<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<MapPinIcon className="h-3 w-3" />{job.location}
									</span>
									<span className="flex items-center gap-1">
										<BriefcaseIcon className="h-3 w-3" />{job.type}
									</span>
									<span className="flex items-center gap-1">
										<MonitorIcon className="h-3 w-3" />{job.jobMode}
									</span>
								</div>
							</div>
							<span className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground">
								<UsersIcon className="h-3 w-3" />
								{job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

function EmployeeJobs() {
	const { data: applications } = useSuspenseQuery(appliedJobsQueryOptions)

	return (
		<div className="flex flex-col gap-4">
			{applications.length === 0 ? (
				<p className="text-sm text-muted-foreground">You haven't applied to any jobs yet.</p>
			) : (
				<div className="flex flex-col divide-y divide-border">
					{applications.map((app) => (
						<Link
							key={app.id}
							to="/jobs/$jobId"
							params={{ jobId: app.job.id }}
							className="flex items-start justify-between gap-4 py-5 px-3 -mx-3 hover:bg-accent/40 transition-colors"
						>
							<div className="flex flex-col gap-2">
								<h3 className="font-semibold text-foreground">{app.job.title}</h3>
								<p className="text-sm text-muted-foreground">{app.job.user.companyName}</p>
								<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<MapPinIcon className="h-3 w-3" />{app.job.location}
									</span>
									<span className="flex items-center gap-1">
										<BriefcaseIcon className="h-3 w-3" />{app.job.type}
									</span>
									<span className="flex items-center gap-1">
										<MonitorIcon className="h-3 w-3" />{app.job.jobMode}
									</span>
								</div>
							</div>
							<div className="flex flex-col items-end gap-1 shrink-0">
								<span className={`text-xs font-semibold ${statusColors[app.status]}`}>
									{app.status}
								</span>
								{app.matchScore !== null && (
									<span className="text-xs text-muted-foreground">
										{app.matchScore?.toFixed(0)}% match
									</span>
								)}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

function MyJobsPage() {
	const { role } = Route.useLoaderData()

	return (
		<div className="px-4 py-8 md:px-12 md:py-12 flex flex-col gap-6 max-w-3xl">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">My Jobs</h1>
					<p className="text-sm text-muted-foreground">
						{role === 'Employer' ? 'Jobs you have posted' : 'Jobs you have applied to'}
					</p>
				</div>
				{role === 'Employer' && (
					<Link to="/jobs/create" className="btn-primary">Create Job</Link>
				)}
			</div>

			{role === 'Employer' ? <EmployerJobs /> : <EmployeeJobs />}
		</div>
	)
}
