import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSignUp } from '@clerk/react/legacy'
import { useClerk } from '@clerk/tanstack-react-start'
import { useState } from 'react'
import { BriefcaseIcon, UserIcon } from 'lucide-react'
import { syncUser, updateUserRole } from '#/utils/user/users.functions'

export const Route = createFileRoute('/sign-up')({
	component: SignUpPage,
})

type Role = 'Employee' | 'Employer'
type Step = 'role' | 'details' | 'account' | 'verify'

function getClerkError(err: unknown, fallback: string): string {
	if (typeof err === 'object' && err !== null && 'errors' in err) {
		const { errors } = err as { errors?: Array<{ message?: string }> }
		return errors?.[0]?.message ?? fallback
	}
	if (err instanceof Error) return err.message
	return fallback
}

function RoleStep({ onSelect }: { onSelect: (role: Role) => void }) {
	return (
		<>
			<StepHeader
				title="Join Bayrozgaar"
				subtitle="Tell us who you are to get started."
			/>
			<div className="grid grid-cols-2 gap-3">
				<RoleCard
					icon={<BriefcaseIcon className="h-8 w-8 text-primary" />}
					label="Employer"
					description="I want to post jobs and hire talent"
					onClick={() => onSelect('Employer')}
				/>
				<RoleCard
					icon={<UserIcon className="h-8 w-8 text-primary" />}
					label="Employee"
					description="I'm looking for a job"
					onClick={() => onSelect('Employee')}
				/>
			</div>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<a href="/sign-in" className="text-primary font-semibold hover:underline">
					Sign In
				</a>
			</p>
		</>
	)
}

function RoleCard({
	icon,
	label,
	description,
	onClick,
}: {
	icon: React.ReactNode
	label: string
	description: string
	onClick: () => void
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex flex-col items-center gap-3 border border-border bg-muted p-6 transition-colors hover:border-primary hover:bg-accent cursor-pointer"
		>
			{icon}
			<span className="font-semibold text-sm text-foreground">{label}</span>
			<span className="text-xs text-muted-foreground text-center">{description}</span>
		</button>
	)
}

function DetailsStep({
	companyName,
	companySite,
	error,
	onCompanyName,
	onCompanySite,
	onBack,
	onNext,
}: {
	companyName: string
	companySite: string
	error: string
	onCompanyName: (v: string) => void
	onCompanySite: (v: string) => void
	onBack: () => void
	onNext: (e: React.FormEvent) => void
}) {
	return (
		<>
			<StepHeader
				title="Company Details"
				subtitle="Tell us about your company."
			/>
			<form onSubmit={onNext} className="flex flex-col gap-5">
				<Field label="Company Name" htmlFor="companyName">
					<input
						id="companyName"
						className="input-field input-field-sm"
						value={companyName}
						onChange={(e) => onCompanyName(e.target.value)}
						placeholder="Acme Corp"
					/>
				</Field>
				<Field label="Company Website" htmlFor="companySite">
					<input
						id="companySite"
						className="input-field input-field-sm"
						value={companySite}
						onChange={(e) => onCompanySite(e.target.value)}
						placeholder="https://acme.com"
					/>
				</Field>
				<ErrorMessage message={error} />
				<div className="flex gap-3">
					<button type="button" onClick={onBack} className="btn-secondary flex-1">
						Back
					</button>
					<button type="submit" className="btn-primary flex-1">
						Next
					</button>
				</div>
			</form>
		</>
	)
}

function AccountStep({
	role,
	companyName,
	firstName,
	lastName,
	email,
	password,
	error,
	loading,
	onChange,
	onBack,
	onSubmit,
}: {
	role: Role
	companyName: string
	firstName: string
	lastName: string
	email: string
	password: string
	error: string
	loading: boolean
	onChange: (field: string, value: string) => void
	onBack: () => void
	onSubmit: (e: React.FormEvent) => void
}) {
	return (
		<>
			<StepHeader
				title="Create Account"
				subtitle={
					<>
						Signing up as{' '}
						<span className="text-primary font-semibold">{role}</span>
						{role === 'Employer' && companyName && ` · ${companyName}`}
					</>
				}
			/>
			<form onSubmit={onSubmit} className="flex flex-col gap-5">
				<div className="grid grid-cols-2 gap-3">
					<Field label="First Name" htmlFor="firstName">
						<input
							id="firstName"
							className="input-field input-field-sm"
							value={firstName}
							onChange={(e) => onChange('firstName', e.target.value)}
							placeholder="John"
							required
						/>
					</Field>
					<Field label="Last Name" htmlFor="lastName">
						<input
							id="lastName"
							className="input-field input-field-sm"
							value={lastName}
							onChange={(e) => onChange('lastName', e.target.value)}
							placeholder="Doe"
							required
						/>
					</Field>
				</div>
				<Field label="Email" htmlFor="email">
					<input
						id="email"
						type="email"
						className="input-field input-field-sm"
						value={email}
						onChange={(e) => onChange('email', e.target.value)}
						placeholder="you@example.com"
						required
					/>
				</Field>
				<Field label="Password" htmlFor="password">
					<input
						id="password"
						type="password"
						className="input-field input-field-sm"
						value={password}
						onChange={(e) => onChange('password', e.target.value)}
						placeholder="••••••••"
						required
					/>
				</Field>
				<ErrorMessage message={error} />
				<div className="flex gap-3">
					<button type="button" onClick={onBack} className="btn-secondary flex-1">
						Back
					</button>
					<button
						type="submit"
						disabled={loading}
						className="btn-primary flex-1 disabled:opacity-50"
					>
						{loading ? 'Creating account...' : 'Get Started'}
					</button>
				</div>
			</form>
		</>
	)
}

function VerifyStep({
	email,
	code,
	error,
	loading,
	onCode,
	onSubmit,
}: {
	email: string
	code: string
	error: string
	loading: boolean
	onCode: (v: string) => void
	onSubmit: (e: React.FormEvent) => void
}) {
	return (
		<>
			<StepHeader
				title="Check your email"
				subtitle={
					<>
						We sent a 6-digit code to{' '}
						<span className="text-foreground font-medium">{email}</span>
					</>
				}
			/>
			<form onSubmit={onSubmit} className="flex flex-col gap-5">
				<Field label="Verification Code" htmlFor="code">
					<input
						id="code"
						className="input-field input-field-sm tracking-widest"
						value={code}
						onChange={(e) => onCode(e.target.value)}
						placeholder="123456"
						maxLength={6}
						required
					/>
				</Field>
				<ErrorMessage message={error} />
				<button
					type="submit"
					disabled={loading}
					className="btn-primary disabled:opacity-50"
				>
					{loading ? 'Verifying...' : 'Verify Email'}
				</button>
			</form>
		</>
	)
}

function StepHeader({
	title,
	subtitle,
}: {
	title: string
	subtitle: React.ReactNode
}) {
	return (
		<div className="mb-8">
			<h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
			<p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
		</div>
	)
}

function Field({
	label,
	htmlFor,
	children,
}: {
	label: string
	htmlFor: string
	children: React.ReactNode
}) {
	return (
		<div className="form-item">
			<label htmlFor={htmlFor} className="form-label">
				{label}
			</label>
			{children}
		</div>
	)
}

function ErrorMessage({ message }: { message: string }) {
	if (!message) return null
	return <p className="text-xs text-destructive">{message}</p>
}

function SignUpPage() {
	const { signUp } = useSignUp()
	const { setActive } = useClerk()
	const navigate = useNavigate()

	const [step, setStep] = useState<Step>('role')
	const [role, setRole] = useState<Role | null>(null)
	const [fields, setFields] = useState({
		companyName: '',
		companySite: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		code: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	function setField(key: string, value: string) {
		setFields((prev) => ({ ...prev, [key]: value }))
	}

	function handleRoleSelect(selected: Role) {
		setRole(selected)
		setStep(selected === 'Employer' ? 'details' : 'account')
	}

	function handleDetailsNext(e: React.FormEvent) {
		e.preventDefault()
		if (!fields.companyName.trim() || !fields.companySite.trim()) {
			setError('Both fields are required.')
			return
		}
		setError('')
		setStep('account')
	}

	async function handleAccountSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!signUp || !role) {
			setError('Authentication system is not ready.')
			return
		}
		
		setLoading(true)
		setError('')
		
		try {
			
			const result = await signUp.create({
				firstName: fields.firstName,
				lastName: fields.lastName,
				emailAddress: fields.email,
				password: fields.password,
			})

			// Prepare email verification
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
			
			setStep('verify')
		} catch (err) {
			console.error('Sign up error:', err)
			setError(getClerkError(err, 'Sign up failed. Please try again.'))
		} finally {
			setLoading(false)
		}
	}

	async function handleVerify(e: React.FormEvent) {
		e.preventDefault()
		if (!signUp || !role) {
			setError('Authentication system is not ready.')
			return
		}
		
		setLoading(true)
		setError('')
		
		try {
			// Attempt verification
			const result = await signUp.attemptEmailAddressVerification({ 
				code: fields.code 
			})
			
			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId })
				await syncUser()
				await updateUserRole(
					role === 'Employer'
						? { data: { role, companyName: fields.companyName, companySite: fields.companySite } }
						: { data: { role } },
				)
				navigate({ to: '/' })
				return
			}
			
			setError('Verification needs another step that this form does not support yet.')
		} catch (err) {
			console.error('Verification error:', err)
			setError(getClerkError(err, 'Invalid code. Please try again.'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div id="sign-up" className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md border border-border bg-card p-8">
				{step === 'role' && (
					<RoleStep onSelect={handleRoleSelect} />
				)}
				{step === 'details' && (
					<DetailsStep
						companyName={fields.companyName}
						companySite={fields.companySite}
						error={error}
						onCompanyName={(v) => setField('companyName', v)}
						onCompanySite={(v) => setField('companySite', v)}
						onBack={() => { setStep('role'); setError('') }}
						onNext={handleDetailsNext}
					/>
				)}
				{step === 'account' && role && (
					<AccountStep
						role={role}
						companyName={fields.companyName}
						firstName={fields.firstName}
						lastName={fields.lastName}
						email={fields.email}
						password={fields.password}
						error={error}
						loading={loading}
						onChange={setField}
						onBack={() => { setStep(role === 'Employer' ? 'details' : 'role'); setError('') }}
						onSubmit={handleAccountSubmit}
					/>
				)}
				{step === 'verify' && (
					<VerifyStep
						email={fields.email}
						code={fields.code}
						error={error}
						loading={loading}
						onCode={(v) => setField('code', v)}
						onSubmit={handleVerify}
					/>
				)}
			</div>
		</div>
	)
}