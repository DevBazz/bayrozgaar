import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Navbar() {
	return (
		<nav className="navbar frame">
			<Link to="/" className="brand">
				<div className="mark">
					<div className="glyph" />
				</div>
				<span>Bayrozgaar</span>
			</Link>

			<div className="actions">
				<SignedOut>
					<Link to="/sign-in" className="btn-secondary">Sign In</Link>
					<Link to="/sign-up" className="btn-primary">Sign Up</Link>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	)
}
