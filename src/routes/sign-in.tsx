import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClerk } from '@clerk/tanstack-react-start'
import { useState } from 'react'
import { syncUser } from '#/utils/user/users.functions'

export const Route = createFileRoute('/sign-in')({
	component: SignInPage,
})

function getAuthErrorMessage(err: unknown, fallback: string) {
	if (typeof err === 'object' && err && 'errors' in err) {
		const clerkError = err as { errors?: Array<{ message?: string }> }
		return clerkError.errors?.[0]?.message ?? fallback
	}
	if (err instanceof Error) return err.message
	return fallback
}

function SignInPage() {
	const { client, setActive } = useClerk()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		
		if (!client) {
			setError('Authentication system is not ready. Please try again.')
			return
		}
		
		setLoading(true)
		setError('')
		
		try {
			// Create sign-in attempt using the client
			const signIn = await client.signIn.create({
				identifier: email,
				password: password,
			})
			
			if (signIn.status === 'complete') {
				// Set the active session
				await setActive({ session: signIn.createdSessionId })
				
				// Sync user data
				try {
					await syncUser()
				} catch (syncError) {
					console.error('User sync failed after sign in', syncError)
				}
				
				// Navigate to home page
				navigate({ to: '/' })
				return
			}
			
			// Handle other statuses
			if (signIn.status === 'needs_second_factor') {
				setError('Two-factor authentication required')
			} else {
				setError('Sign in needs additional verification')
			}
		} catch (err: unknown) {
			console.error('Sign in error:', err)
			setError(getAuthErrorMessage(err, 'Sign in failed. Please try again.'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div id="sign-in" className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md border border-border bg-card p-8">
				<div className="mb-8">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">Sign In</h1>
					<p className="mt-1 text-sm text-muted-foreground">Welcome back to Bayrozgaar</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
							disabled={loading}
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
							disabled={loading}
						/>
					</div>

					{error && <p className="text-xs text-destructive">{error}</p>}

					<button
						type="submit"
						disabled={loading || !client}
						className="btn-primary w-full disabled:opacity-50"
					>
						{loading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Don't have an account?{' '}
					<a href="/sign-up" className="text-primary font-semibold hover:underline">Sign Up</a>
				</p>
			</div>
		</div>
	)
}