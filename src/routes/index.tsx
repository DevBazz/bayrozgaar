import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAllJobFn } from '#/utils/job/job.functions'
import JobCard from '#/components/job-card'

const allJobsQueryOptions = queryOptions({
	queryKey: ['jobs'],
	queryFn: () => getAllJobFn(),
})

export const Route = createFileRoute('/')(({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(allJobsQueryOptions),
	component: HomePage,
}))

function HomePage() {
	const { data: jobs } = useSuspenseQuery(allJobsQueryOptions)

	return (
		<div id="home">
			<div className="px-4 py-8 md:px-12 md:py-12">
				<h2 className="text-2xl font-bold text-foreground mb-2">Latest Jobs</h2>
				<p className="text-muted-foreground text-sm mb-8">{jobs.length} open positions</p>

				{jobs.length === 0 ? (
					<p className="text-muted-foreground">No jobs posted yet.</p>
				) : (
					<div className="flex flex-col divide-y divide-border">
						{jobs.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
