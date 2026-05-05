/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getJobByIdFn, updateJobFn, deleteJobFn } from '#/utils/job/job.functions'
import { getRole } from '#/utils/user/users.functions'
import { ArrowLeftIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react'

const jobQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ['jobs', id],
		queryFn: () => getJobByIdFn({ data: id }),
	})

export const Route = createFileRoute('/jobs/$jobId/edit')({
	loader: async ({ context: { queryClient }, params: { jobId } }) => {
		const role = await getRole()
		if (!role) throw redirect({ to: '/sign-in' })
		if (role !== 'Employer') throw redirect({ to: '/' })
		const job = await queryClient.ensureQueryData(jobQueryOptions(jobId))
		if (!job) throw redirect({ to: '/' })
		return { job }
	},
	component: EditJobPage,
})

const JOB_TYPES = ['FullTime', 'PartTime', 'Contract', 'Internship'] as const
const JOB_MODES = ['Remote', 'Onsite', 'Hybrid'] as const

function EditJobPage() {
	const { jobId } = Route.useParams()
	const { data: job } = useSuspenseQuery(jobQueryOptions(jobId))
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [title, setTitle] = useState(job!.title)
	const [description, setDescription] = useState(job!.description)
	const [location, setLocation] = useState(job!.location)
	const [salary, setSalary] = useState(String(job!.salary))
	const [type, setType] = useState<typeof JOB_TYPES[number]>(job!.type)
	const [jobMode, setJobMode] = useState<typeof JOB_MODES[number]>(job!.jobMode)
	const [requirements, setRequirements] = useState(
		() => job!.requirements.map((r) => ({ id: crypto.randomUUID(), value: r }))
	)
	const [loading, setLoading] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [error, setError] = useState('')

	function addRequirement() {
		setRequirements((prev) => [...prev, { id: crypto.randomUUID(), value: '' }])
	}
	function updateRequirement(id: string, value: string) {
		setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)))
	}
	function removeRequirement(id: string) {
		setRequirements((prev) => prev.filter((r) => r.id !== id))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const filtered = requirements.map((r) => r.value).filter((v) => v.trim())
		if (!filtered.length) { setError('Add at least one requirement.'); return }
		setLoading(true)
		setError('')
		try {
			await updateJobFn({
				data: {
					id: jobId,
					jobData: { title, description, location, salary: Number(salary), type, jobMode, requirements: filtered },
				},
			})
			queryClient.invalidateQueries({ queryKey: ['jobs', jobId] })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['my-jobs', 'employer'] })
			navigate({ to: '/jobs/$jobId', params: { jobId } })
		} catch (err: any) {
			setError(err?.message ?? 'Failed to update job.')
		} finally {
			setLoading(false)
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) return
		setDeleting(true)
		try {
			await deleteJobFn({ data: jobId })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['my-jobs', 'employer'] })
			navigate({ to: '/my-jobs' })
		} catch (err: any) {
			setError(err?.message ?? 'Failed to delete job.')
			setDeleting(false)
		}
	}

	return (
		<div className="px-4 py-8 md:px-12 md:py-12 flex flex-col gap-8 max-w-3xl">
			<Link
				to="/jobs/$jobId"
				params={{ jobId }}
				className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit transition-colors"
			>
				<ArrowLeftIcon className="h-4 w-4" />
				Back to job
			</Link>

			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Job</h1>
					<p className="text-sm text-muted-foreground">Update your job listing details.</p>
				</div>
				<button
					type="button"
					onClick={handleDelete}
					disabled={deleting}
					className="flex items-center gap-2 text-sm text-destructive border border-destructive/40 px-3 py-2 hover:bg-destructive/10 transition-colors disabled:opacity-50"
				>
					<Trash2Icon className="h-4 w-4" />
					{deleting ? 'Deleting...' : 'Delete Job'}
				</button>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="form-item">
					<label htmlFor="title" className="form-label">Job Title</label>
					<input
						id="title"
						className="input-field input-field-sm"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>

				<div className="form-item">
					<label htmlFor="description" className="form-label">Description</label>
					<textarea
						id="description"
						className="input-field input-field-sm input-field-textarea min-h-32"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="form-item">
						<label htmlFor="location" className="form-label">Location</label>
						<input
							id="location"
							className="input-field input-field-sm"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							required
						/>
					</div>
					<div className="form-item">
						<label htmlFor="salary" className="form-label">Monthly Salary (Rs)</label>
						<input
							id="salary"
							type="number"
							min="0"
							className="input-field input-field-sm"
							value={salary}
							onChange={(e) => setSalary(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="form-item">
						<label className="form-label">Job Type</label>
						<div className="flex flex-wrap gap-2">
							{JOB_TYPES.map((t) => (
								<button
									key={t}
									type="button"
									onClick={() => setType(t)}
									className={`px-3 py-1.5 text-xs font-medium border transition-colors ${type === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-foreground hover:border-primary'}`}
								>
									{t}
								</button>
							))}
						</div>
					</div>
					<div className="form-item">
						<label className="form-label">Job Mode</label>
						<div className="flex flex-wrap gap-2">
							{JOB_MODES.map((m) => (
								<button
									key={m}
									type="button"
									onClick={() => setJobMode(m)}
									className={`px-3 py-1.5 text-xs font-medium border transition-colors ${jobMode === m ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-foreground hover:border-primary'}`}
								>
									{m}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="form-item">
					<label className="form-label">Requirements</label>
					<div className="flex flex-col gap-2">
						{requirements.map((req, i) => (
							<div key={req.id} className="flex gap-2">
								<input
									className="input-field input-field-sm flex-1"
									value={req.value}
									onChange={(e) => updateRequirement(req.id, e.target.value)}
									placeholder={`Requirement ${i + 1}`}
								/>
								{requirements.length > 1 && (
									<button type="button" onClick={() => removeRequirement(req.id)} className="btn-secondary px-3!">
										<XIcon className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
						<button type="button" onClick={addRequirement} className="btn-secondary w-fit flex items-center gap-2">
							<PlusIcon className="h-4 w-4" />
							Add requirement
						</button>
					</div>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="border-t border-border pt-6">
					<button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
						{loading ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</form>
		</div>
	)
}
