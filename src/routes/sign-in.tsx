import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSignIn } from '@clerk/clerk-react'
import { useState } from 'react'
import { syncUser } from '#/utils/user/users.functions'

export const Route = createFileRoute('/sign-in')({
	component: SignInPage,
})

function SignInPage() {
	const { signIn, isLoaded, setActive } = useSignIn()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!isLoaded) return
		setLoading(true)
		setError('')
		try {
			const result = await signIn.create({ identifier: email, password })
			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId })
				await syncUser()
				navigate({ to: '/' })
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.message ?? 'Sign in failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div id="sign-in">
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

					<button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
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
