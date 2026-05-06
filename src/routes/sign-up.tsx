import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSignUp } from '@clerk/tanstack-react-start'
import { useState } from 'react'
import { BriefcaseIcon, UserIcon } from 'lucide-react'
import { syncUser, updateUserRole } from '#/utils/user/users.functions'

export const Route = createFileRoute('/sign-up')({
	component: SignUpPage,
})

type Role = 'Employee' | 'Employer'
type Step = 'role' | 'details' | 'account' | 'verify'

function SignUpPage() {
	const { signUp, isLoaded, setActive } = useSignUp()
	const navigate = useNavigate()

	const [step, setStep] = useState<Step>('role')
	const [role, setRole] = useState<Role | null>(null)
	const [companyName, setCompanyName] = useState('')
	const [companySite, setCompanySite] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [code, setCode] = useState('')
	const [loading, setLoading] = useState(false)

	function handleRoleSelect(selected: Role) {
		setRole(selected)
		setStep(selected === 'Employer' ? 'details' : 'account')
	}

	function handleDetailsNext(e: React.FormEvent) {
		e.preventDefault()
		if (!companyName.trim() || !companySite.trim()) {
			setError('Both fields are required.')
			return
		}
		setError('')
		setStep('account')
	}

	async function handleAccountSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!isLoaded || !role) return
		setLoading(true)
		setError('')
		try {
			await signUp.create({
				firstName,
				lastName,
				emailAddress: email,
				password,
			})
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
			setStep('verify')
		} catch (err: any) {
			setError(err.errors?.[0]?.message ?? 'Sign up failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	async function handleVerify(e: React.FormEvent) {
		e.preventDefault()
		if (!isLoaded || !role) return
		setLoading(true)
		setError('')
		try {
			const result = await signUp.attemptEmailAddressVerification({ code })
			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId })
				await syncUser()
				await updateUserRole({
					data: role === 'Employer'
						? { role, companyName, companySite }
						: { role },
				})
				navigate({ to: '/' })
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.message ?? 'Invalid code. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div id="sign-up">
			<div className="w-full max-w-md border border-border bg-card p-8">

				{step === 'role' && (
					<>
						<div className="mb-8">
							<h1 className="text-2xl font-bold tracking-tight text-foreground">Join Bayrozgaar</h1>
							<p className="mt-1 text-sm text-muted-foreground">Tell us who you are to get started.</p>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => handleRoleSelect('Employer')}
								className="flex flex-col items-center gap-3 border border-border bg-muted p-6 transition-colors hover:border-primary hover:bg-accent cursor-pointer"
							>
								<BriefcaseIcon className="h-8 w-8 text-primary" />
								<span className="font-semibold text-sm text-foreground">Employer</span>
								<span className="text-xs text-muted-foreground text-center">I want to post jobs and hire talent</span>
							</button>

							<button
								type="button"
								onClick={() => handleRoleSelect('Employee')}
								className="flex flex-col items-center gap-3 border border-border bg-muted p-6 transition-colors hover:border-primary hover:bg-accent cursor-pointer"
							>
								<UserIcon className="h-8 w-8 text-primary" />
								<span className="font-semibold text-sm text-foreground">Employee</span>
								<span className="text-xs text-muted-foreground text-center">I'm looking for a job</span>
							</button>
						</div>

						<p className="mt-6 text-center text-sm text-muted-foreground">
							Already have an account?{' '}
							<a href="/sign-in" className="text-primary font-semibold hover:underline">Sign In</a>
						</p>
					</>
				)}

				{step === 'details' && (
					<>
						<div className="mb-8">
							<h1 className="text-2xl font-bold tracking-tight text-foreground">Company Details</h1>
							<p className="mt-1 text-sm text-muted-foreground">Tell us about your company.</p>
						</div>

						<form onSubmit={handleDetailsNext} className="flex flex-col gap-5">
							<div className="form-item">
								<label htmlFor="companyName" className="form-label">Company Name</label>
								<input
									id="companyName"
									className="input-field input-field-sm"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
									placeholder="Acme Corp"
								/>
							</div>

							<div className="form-item">
								<label htmlFor="companySite" className="form-label">Company Website</label>
								<input
									id="companySite"
									className="input-field input-field-sm"
									value={companySite}
									onChange={(e) => setCompanySite(e.target.value)}
									placeholder="https://acme.com"
								/>
							</div>

							{error && <p className="text-xs text-destructive">{error}</p>}

							<div className="flex gap-3">
								<button type="button" onClick={() => { setStep('role'); setError('') }} className="btn-secondary flex-1">Back</button>
								<button type="submit" className="btn-primary flex-1">Next</button>
							</div>
						</form>
					</>
				)}

				{step === 'account' && (
					<>
						<div className="mb-8">
							<h1 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								Signing up as <span className="text-primary font-semibold">{role}</span>
								{role === 'Employer' && companyName && ` · ${companyName}`}
							</p>
						</div>

						<form onSubmit={handleAccountSubmit} className="flex flex-col gap-5">
							<div className="grid grid-cols-2 gap-3">
								<div className="form-item">
									<label htmlFor="firstName" className="form-label">First Name</label>
									<input
										id="firstName"
										className="input-field input-field-sm"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										placeholder="John"
										required
									/>
								</div>
								<div className="form-item">
									<label htmlFor="lastName" className="form-label">Last Name</label>
									<input
										id="lastName"
										className="input-field input-field-sm"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										placeholder="Doe"
										required
									/>
								</div>
							</div>

							<div className="form-item">
								<label htmlFor="email" className="form-label">Email</label>
								<input
									id="email"
									type="email"
									className="input-field input-field-sm"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									required
								/>
							</div>

							<div className="form-item">
								<label htmlFor="password" className="form-label">Password</label>
								<input
									id="password"
									type="password"
									className="input-field input-field-sm"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									required
								/>
							</div>

							{error && <p className="text-xs text-destructive">{error}</p>}

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => { setStep(role === 'Employer' ? 'details' : 'role'); setError('') }}
									className="btn-secondary flex-1"
								>
									Back
								</button>
								<button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
									{loading ? 'Creating account...' : 'Get Started'}
								</button>
							</div>
						</form>
					</>
				)}
				{step === 'verify' && (
				<>
					<div className="mb-8">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
						</p>
					</div>

					<form onSubmit={handleVerify} className="flex flex-col gap-5">
						<div className="form-item">
							<label htmlFor="code" className="form-label">Verification Code</label>
							<input
								id="code"
								className="input-field input-field-sm tracking-widest"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder="123456"
								maxLength={6}
								required
							/>
						</div>

						{error && <p className="text-xs text-destructive">{error}</p>}

						<button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
							{loading ? 'Verifying...' : 'Verify Email'}
						</button>
					</form>
				</>
			)}
		</div>
		</div>
	)
}
