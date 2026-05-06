import { Link } from '@tanstack/react-router'
import { UserButton, useAuth } from '@clerk/tanstack-react-start'
import { useQuery } from '@tanstack/react-query'
import { getRole } from '#/utils/user/users.functions'

export default function Navbar() {
	const { isLoaded, isSignedIn } = useAuth()

	const { data: role } = useQuery({
		queryKey: ['role'],
		queryFn: () => getRole(),
		enabled: !!isSignedIn,
	})

	return (
		<nav className="navbar frame">
			<Link to="/" className="brand">
				<div className="mark">
					<div className="glyph" />
				</div>
				<span>Bayrozgaar</span>
			</Link>

			<div className="actions">
				{isLoaded && !isSignedIn && (
					<>
						<Link to="/sign-in" className="btn-secondary">Sign In</Link>
						<Link to="/sign-up" className="btn-primary">Sign Up</Link>
					</>
				)}
				{isLoaded && isSignedIn && (
					<>
						<Link to="/my-jobs" className="btn-secondary">My Jobs</Link>
						{role === 'Employer' && (
							<Link to="/jobs/create" className="btn-primary">Create Job</Link>
						)}
						<Link to="/profile" className="btn-secondary">Profile</Link>
						<UserButton />
					</>
				)}
			</div>
		</nav>
	)
}
