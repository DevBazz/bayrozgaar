import {
  UserButton,
  useAuth,
} from '@clerk/tanstack-react-start'
import { Link } from '@tanstack/react-router'

export default function HeaderUser() {
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <>
      {isLoaded && isSignedIn && (
        <UserButton />
      )}
      {isLoaded && !isSignedIn && (
        <Link to="/sign-in">Sign In</Link>
      )}
    </>
  )
}
