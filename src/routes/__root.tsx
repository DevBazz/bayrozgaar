import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ClerkProvider from '../integrations/clerk/provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import Navbar from '../components/navbar'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
				<Scripts />
			</body>
		</html>
	)
}
