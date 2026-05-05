/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getRole } from '#/utils/user/users.functions'
import { createJobFn } from '#/utils/job/job.functions'
import { PlusIcon, XIcon } from 'lucide-react'

export const Route = createFileRoute('/jobs/create')({
	loader: async () => {
		const role = await getRole()
		if (!role) throw redirect({ to: '/sign-in' })
		if (role !== 'Employer') throw redirect({ to: '/' })
	},
	component: CreateJobPage,
})

const JOB_TYPES = ['FullTime', 'PartTime', 'Contract', 'Internship'] as const
const JOB_MODES = ['Remote', 'Onsite', 'Hybrid'] as const

function CreateJobPage() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	type Requirement = { id: string; value: string }

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [location, setLocation] = useState('')
	const [salary, setSalary] = useState('')
	const [type, setType] = useState<typeof JOB_TYPES[number]>('FullTime')
	const [jobMode, setJobMode] = useState<typeof JOB_MODES[number]>('Remote')
	const [requirements, setRequirements] = useState<Requirement[]>([{ id: crypto.randomUUID(), value: '' }])
	const [loading, setLoading] = useState(false)
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
		const filtered = requirements.filter((r) => r.value.trim()).map(r => r.value)
		if (!filtered.length) {
			setError('Add at least one requirement.')
			return
		}
		setLoading(true)
		setError('')
		try {
			const job = await createJobFn({
				data: {
					title,
					description,
					location,
					salary: Number(salary),
					type,
					jobMode,
					requirements: filtered,
				},
			})
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['my-jobs', 'employer'] })
			navigate({ to: '/jobs/$jobId', params: { jobId: job.id } })
		} catch (err: any) {
			setError(err?.message ?? 'Failed to create job.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="px-4 py-8 md:px-12 md:py-12 flex flex-col gap-8 max-w-3xl">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">Create Job</h1>
				<p className="text-sm text-muted-foreground">Fill in the details to post a new job listing.</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="form-item">
					<label htmlFor="title" className="form-label">Job Title</label>
					<input
						id="title"
						className="input-field input-field-sm"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="e.g. Senior Frontend Engineer"
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
						placeholder="Describe the role, responsibilities, and what you're looking for..."
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
							placeholder="e.g. Karachi, Pakistan"
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
							placeholder="e.g. 120000"
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
									className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
										type === t
											? 'border-primary bg-primary text-primary-foreground'
											: 'border-border bg-muted text-foreground hover:border-primary'
									}`}
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
									className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
										jobMode === m
											? 'border-primary bg-primary text-primary-foreground'
											: 'border-border bg-muted text-foreground hover:border-primary'
									}`}
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
									<button
										type="button"
										onClick={() => removeRequirement(req.id)}
										className="btn-secondary px-3!"
									>
										<XIcon className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							onClick={addRequirement}
							className="btn-secondary w-fit flex items-center gap-2"
						>
							<PlusIcon className="h-4 w-4" />
							Add requirement
						</button>
					</div>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="border-t border-border pt-6">
					<button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
						{loading ? 'Posting...' : 'Post Job'}
					</button>
				</div>
			</form>
		</div>
	)
}
