import { useState } from 'react'
import { useAuth } from '@clerk/tanstack-react-start'
import { Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UploadIcon, FileTextIcon, CheckCircleIcon, LoaderIcon } from 'lucide-react'
import { uploadToUploadThingFn } from '#/lib/uploadthing'
import { getResumeFn, parseAndSaveResumeFn } from '#/utils/resume/resume.functions'
import { createApplicationFn } from '#/utils/application/application.functions'

interface ApplySectionProps {
	jobId: string
}

type State = 'idle' | 'uploading' | 'parsing' | 'submitting' | 'done' | 'error' | 'already_applied'

export default function ApplySection({ jobId }: ApplySectionProps) {
	const { isSignedIn } = useAuth()
	const queryClient = useQueryClient()
	const [state, setState] = useState<State>('idle')
	const [matchScore, setMatchScore] = useState<number | null>(null)
	const [error, setError] = useState('')

	const { data: resume, isLoading: resumeLoading } = useQuery({
		queryKey: ['resume'],
		queryFn: () => getResumeFn(),
		enabled: !!isSignedIn,
	})

	if (!isSignedIn) {
		return (
			<div className="flex flex-col gap-3 border border-border bg-muted p-6">
				<p className="text-sm text-muted-foreground">You need to be signed in to apply for this job.</p>
				<Link to="/sign-in" className="btn-primary w-fit">Sign In to Apply</Link>
			</div>
		)
	}

	if (resumeLoading) {
		return (
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<LoaderIcon className="h-4 w-4 animate-spin" />
				Loading...
			</div>
		)
	}

	if (state === 'done') {
		return (
			<div className="flex flex-col gap-3 border border-border bg-muted p-6">
				<div className="flex items-center gap-2 text-primary">
					<CheckCircleIcon className="h-5 w-5" />
					<span className="font-semibold">Application submitted!</span>
				</div>
				{matchScore !== null && (
					<p className="text-sm text-muted-foreground">
						Your resume matched this job{' '}
						<span className="font-bold text-foreground">{matchScore.toFixed(0)}%</span>
					</p>
				)}
			</div>
		)
	}

	if (state === 'already_applied') {
		return (
			<div className="flex items-center gap-2 border border-border bg-muted p-6 text-sm text-muted-foreground">
				<CheckCircleIcon className="h-4 w-4 text-primary" />
				You have already applied for this job.
			</div>
		)
	}

	const isProcessing = ['uploading', 'parsing', 'submitting'].includes(state)

	const statusLabel = {
		uploading: 'Uploading resume...',
		parsing: 'Parsing PDF...',
		submitting: 'Submitting application...',
	}[state as 'uploading' | 'parsing' | 'submitting']

	async function applyWithResume(resumeId: string) {
		setState('submitting')
		try {
			const application = await createApplicationFn({ data: { jobId, resumeId } })
			setMatchScore(application.matchScore ?? null)
			setState('done')
			queryClient.invalidateQueries({ queryKey: ['jobs', jobId] })
		} catch (err: any) {
			if (err?.message?.includes('Already applied')) {
				setState('already_applied')
			} else {
				setError(err?.message ?? 'Failed to submit application.')
				setState('error')
			}
		}
	}

	async function handleUploadAndApply(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		setError('')
		setState('uploading')
		try {
			// Read file as base64
			const base64Data = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader()
				reader.onload = () => resolve(reader.result as string)
				reader.onerror = reject
				reader.readAsDataURL(file)
			})

			// Upload to UploadThing via server function
			const result = await uploadToUploadThingFn({
				data: {
					fileName: file.name,
					fileData: base64Data,
					fileSize: file.size,
				},
			})

			setState('parsing')

			// Parse and save resume
				const savedResume = await parseAndSaveResumeFn({ data: { url: result.url, base64Data } })
			if (!savedResume?.id) throw new Error('Failed to save resume. Please try again.')
			await applyWithResume(savedResume.id)
		} catch (err: any) {
			setError(err?.message ?? 'Upload failed. Please try again.')
			setState('error')
		}
	}

	return (
		<div className="flex flex-col gap-4">
			{isProcessing && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<LoaderIcon className="h-4 w-4 animate-spin" />
					{statusLabel}
				</div>
			)}

			{state === 'error' && (
				<p className="text-sm text-destructive">{error}</p>
			)}

			{!isProcessing && state !== 'error' && resume ? (
				<div className="flex flex-col gap-4 border border-border bg-muted p-6">
					<div className="flex items-center gap-3">
						<FileTextIcon className="h-5 w-5 text-primary shrink-0" />
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold text-foreground">Resume on file</span>
							<a href={resume.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
								View current resume
							</a>
						</div>
					</div>
					<div className="flex gap-3">
						<button type="button" onClick={() => applyWithResume(resume.id)} className="btn-primary">
							Apply with this resume
						</button>
						<label className="btn-secondary cursor-pointer">
							Upload new resume
							<input type="file" accept=".pdf" className="hidden" onChange={handleUploadAndApply} />
						</label>
					</div>
				</div>
			) : !isProcessing ? (
				<div className="flex flex-col gap-4 border border-border bg-muted p-6">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-foreground">Upload your resume</span>
						<span className="text-xs text-muted-foreground">PDF only · Max 10MB</span>
					</div>
					<label className="btn-primary w-fit cursor-pointer flex items-center gap-2">
						<UploadIcon className="h-4 w-4" />
						Choose PDF
						<input type="file" accept=".pdf" className="hidden" onChange={handleUploadAndApply} />
					</label>
				</div>
			) : null}
		</div>
	)
}
