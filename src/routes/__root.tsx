import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ClerkProvider from '../integrations/clerk/provider'
import TanstackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import Navbar from '../components/navbar'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

// This server function runs on every navigation and seeds Clerk auth into context
const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  return { userId }
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth()
    return { userId }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Bayrozgaar' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootDocument,
})

function AppShell() {
  return (
    <div id="root-layout">
      <header>
        <Navbar />
      </header>
      <main>
        <div className="frame">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TanstackQueryProvider>
          <ClerkProvider>
            <AppShell />
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
                TanStackQueryDevtools,
              ]}
            />
          </ClerkProvider>
        </TanstackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}