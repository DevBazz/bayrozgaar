/** biome-ignore-all lint/a11y/noAutofocus: <explanation> */
import { createFileRoute, redirect } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getUser, updateUser } from '#/utils/user/users.functions'
import { getResumeFn, parseAndSaveResumeFn } from '#/utils/resume/resume.functions'
import { uploadToUploadThingFn } from '#/lib/uploadthing'
import {
	UserIcon,
	BuildingIcon,
	FileTextIcon,
	UploadIcon,
	PencilIcon,
	CheckIcon,
	XIcon,
	LoaderIcon,
} from 'lucide-react'

const profileQueryOptions = queryOptions({
	queryKey: ['profile'],
	queryFn: () => getUser(),
})

const resumeQueryOptions = queryOptions({
	queryKey: ['resume'],
	queryFn: () => getResumeFn(),
})

export const Route = createFileRoute('/profile')({
	loader: async ({ context: { queryClient } }) => {
		const user = await queryClient.ensureQueryData(profileQueryOptions)
		if (!user) throw redirect({ to: '/sign-in' })
		if (user.role === 'Employee') {
			await queryClient.ensureQueryData(resumeQueryOptions)
		}
	},
	component: ProfilePage,
})

function EditableField({
	label,
	value,
	onSave,
	placeholder,
}: {
	label: string
	value: string
	onSave: (val: string) => Promise<void>
	placeholder?: string
}) {
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState(value)
	const [saving, setSaving] = useState(false)

	async function handleSave() {
		setSaving(true)
		await onSave(draft)
		setSaving(false)
		setEditing(false)
	}

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
			{editing ? (
				<div className="flex gap-2">
					<input
						className="input-field input-field-sm flex-1"
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder={placeholder}
						autoFocus
					/>
					<button type="button" onClick={handleSave} disabled={saving} className="btn-primary px-3! disabled:opacity-50">
						{saving ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
					</button>
					<button type="button" onClick={() => { setEditing(false); setDraft(value) }} className="btn-secondary px-3!">
						<XIcon className="h-4 w-4" />
					</button>
				</div>
			) : (
				<div className="flex items-center gap-2 group">
					<span className="text-sm text-foreground">{value || <span className="text-muted-foreground italic">Not set</span>}</span>
					<button
						type="button"
						onClick={() => setEditing(true)}
						className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
					>
						<PencilIcon className="h-3.5 w-3.5" />
					</button>
				</div>
			)}
		</div>
	)
}

function ResumeSection() {
	const queryClient = useQueryClient()
	const { data: resume } = useSuspenseQuery(resumeQueryOptions)
	const [uploading, setUploading] = useState(false)
	const [parsing, setParsing] = useState(false)
	const [uploadError, setUploadError] = useState('')

	const isProcessing = uploading || parsing

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		setUploadError('')
		setUploading(true)
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

			setUploading(false)
			setParsing(true)

			// Parse and save resume
			const savedResume = await parseAndSaveResumeFn({ data: { url: result.url } })
			if (!savedResume?.id) throw new Error('Failed to save resume. Please try again.')
			setParsing(false)
			queryClient.invalidateQueries({ queryKey: ['resume'] })
		} catch (err: any) {
			setUploadError(err?.message ?? 'Upload failed. Please try again.')
			setUploading(false)
			setParsing(false)
		}
	}

	return (
		<div className="flex flex-col gap-4 border border-border p-6">
			<div className="flex items-center gap-2">
				<FileTextIcon className="h-5 w-5 text-primary" />
				<h2 className="font-semibold text-foreground">Resume</h2>
			</div>

			{resume ? (
				<div className="flex flex-col gap-3">
					<a href={resume.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline w-fit">
						View current resume
					</a>
					<p className="text-xs text-muted-foreground">Last updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
					{uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
					<label className="btn-secondary w-fit cursor-pointer flex items-center gap-2">
						{isProcessing ? (
							<><LoaderIcon className="h-4 w-4 animate-spin" />{uploading ? 'Uploading...' : 'Parsing...'}</>
						) : (
							<><UploadIcon className="h-4 w-4" />Replace resume</>
						)}
						<input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={isProcessing} />
					</label>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					<p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
					{uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
					<label className="btn-primary w-fit cursor-pointer flex items-center gap-2">
						{isProcessing ? (
							<><LoaderIcon className="h-4 w-4 animate-spin" />{uploading ? 'Uploading...' : 'Parsing...'}</>
						) : (
							<><UploadIcon className="h-4 w-4" />Upload resume</>
						)}
						<input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={isProcessing} />
					</label>
				</div>
			)}
		</div>
	)
}

function ProfilePage() {
	const queryClient = useQueryClient()
	const { data: user } = useSuspenseQuery(profileQueryOptions)

	if (!user) return null

	async function saveField(field: string, value: string) {
		await updateUser({ data: { user: { [field]: value } } })
		queryClient.invalidateQueries({ queryKey: ['profile'] })
	}

	return (
		<div className="px-4 py-8 md:px-12 md:py-12 flex flex-col gap-8 max-w-2xl">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
				<p className="text-sm text-muted-foreground">Manage your account details.</p>
			</div>

			<div className="flex flex-col gap-6 border border-border p-6">
				<div className="flex items-center gap-2">
					<UserIcon className="h-5 w-5 text-primary" />
					<h2 className="font-semibold text-foreground">Personal Info</h2>
				</div>
				<EditableField label="Full Name" value={user.name} onSave={(val) => saveField('name', val)} placeholder="Your full name" />
				<EditableField label="Username" value={user.username} onSave={(val) => saveField('username', val)} placeholder="username" />
				<div className="flex flex-col gap-1.5">
					<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</span>
					<span className="text-sm text-muted-foreground">{user.email}</span>
				</div>
				<EditableField label="Phone" value={user.phone ?? ''} onSave={(val) => saveField('phone', val)} placeholder="+92 300 0000000" />
			</div>

			{user.role === 'Employer' && (
				<div className="flex flex-col gap-6 border border-border p-6">
					<div className="flex items-center gap-2">
						<BuildingIcon className="h-5 w-5 text-primary" />
						<h2 className="font-semibold text-foreground">Company</h2>
					</div>
					<EditableField label="Company Name" value={user.companyName ?? ''} onSave={(val) => saveField('companyName', val)} placeholder="Acme Corp" />
					<EditableField label="Company Website" value={user.companySite ?? ''} onSave={(val) => saveField('companySite', val)} placeholder="https://acme.com" />
				</div>
			)}

			{user.role === 'Employee' && <ResumeSection />}
		</div>
	)
}
