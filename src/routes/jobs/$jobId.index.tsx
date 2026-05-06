import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-react-start'
import { useQuery } from '@tanstack/react-query'
import { getJobByIdFn } from '#/utils/job/job.functions'
import { getRole } from '#/utils/user/users.functions'
import {
	MapPinIcon,
	BriefcaseIcon,
	MonitorIcon,
	BuildingIcon,
	GlobeIcon,
	ArrowLeftIcon,
	UsersIcon,
	PencilIcon,
} from 'lucide-react'
import ApplySection from '#/components/apply-section'

const jobQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ['jobs', id],
		queryFn: () => getJobByIdFn({ data: id }),
	})

export const Route = createFileRoute('/jobs/$jobId/')({
	loader: async ({ context: { queryClient }, params: { jobId } }) => {
		const job = await queryClient.ensureQueryData(jobQueryOptions(jobId))
		if (!job) throw notFound()
	},
	component: JobDetailPage,
	notFoundComponent: () => (
		<div className="px-4 py-12 md:px-12 text-center">
			<p className="text-muted-foreground">Job not found.</p>
			<Link to="/" className="mt-4 inline-block text-primary text-sm hover:underline">
				← Back to jobs
			</Link>
		</div>
	),
})

function JobDetailPage() {
	const { jobId } = Route.useParams()
	const { data: job } = useSuspenseQuery(jobQueryOptions(jobId))
	const { isSignedIn, userId } = useAuth()
	const { data: role } = useQuery({
		queryKey: ['role'],
		queryFn: () => getRole(),
		enabled: !!isSignedIn,
	})

	if (!job) return null

	const isOwner = job.user.clerkId === userId
	const isEmployer = role === 'Employer'

	return (
		<div className="px-4 py-8 md:px-12 md:py-12 flex flex-col gap-8 max-w-3xl">
			<Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit transition-colors">
				<ArrowLeftIcon className="h-4 w-4" />
				Back to jobs
			</Link>

			{/* Header */}
			<div className="flex flex-col gap-4 border-b border-border pb-8">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">{job.title}</h1>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<BuildingIcon className="h-4 w-4" />
							<span>{job.user.companyName}</span>
							{job.user.companySite && (
								<>
									<span>·</span>
									<a
										href={job.user.companySite}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-1 text-primary hover:underline"
									>
										<GlobeIcon className="h-3 w-3" />
										Website
									</a>
								</>
							)}
						</div>
					</div>
					<div className="flex items-center gap-3 shrink-0">
						<span className="text-lg font-bold text-primary">Rs {job.salary.toLocaleString()}/month</span>
						{isOwner && (
							<div className="flex gap-2">
								<Link
									to="/jobs/$jobId/applications"
									params={{ jobId }}
									className="btn-secondary flex items-center gap-1.5 text-xs"
								>
									<UsersIcon className="h-3.5 w-3.5" />
									Applicants
								</Link>
								<Link
									to="/jobs/$jobId/edit"
									params={{ jobId }}
									className="btn-secondary flex items-center gap-1.5 text-xs"
								>
									<PencilIcon className="h-3.5 w-3.5" />
									Edit
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-2">
					<span className="flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
						<MapPinIcon className="h-3 w-3 text-muted-foreground" />
						{job.location}
					</span>
					<span className="flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
						<BriefcaseIcon className="h-3 w-3 text-muted-foreground" />
						{job.type}
					</span>
					<span className="flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
						<MonitorIcon className="h-3 w-3 text-muted-foreground" />
						{job.jobMode}
					</span>
					<span className="flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
						<UsersIcon className="h-3 w-3 text-muted-foreground" />
						{job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}
					</span>
				</div>
			</div>

			{/* Description */}
			<div className="flex flex-col gap-3">
				<h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">About the role</h2>
				<p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{job.description}</p>
			</div>

			{/* Requirements */}
			{job.requirements.length > 0 && (
				<div className="flex flex-col gap-3">
					<h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Requirements</h2>
					<ul className="flex flex-col gap-2">
						{job.requirements.map((req) => (
							<li key={req} className="flex items-start gap-2 text-sm text-foreground">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
								{req}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Apply */}
			<div className="border-t border-border pt-8">
				{isOwner ? (
					<div className="border border-border bg-muted p-6 text-sm text-muted-foreground">
						You cannot apply to your own job listing.
					</div>
				) : isEmployer ? (
					<div className="border border-border bg-muted p-6 text-sm text-muted-foreground">
						Employer accounts cannot apply for jobs.
					</div>
				) : (
					<ApplySection jobId={job.id} />
				)}
			</div>
		</div>
	)
}
