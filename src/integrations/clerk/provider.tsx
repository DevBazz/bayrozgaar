// integrations/clerk/provider.tsx
import { ClerkProvider } from '@clerk/tanstack-react-start'

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // VITE_ prefix is required for the key to be available client-side
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!publishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}