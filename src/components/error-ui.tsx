import { Link, useRouter } from '@tanstack/react-router'
import { AlertCircleIcon, HomeIcon, RefreshCwIcon, SearchXIcon } from 'lucide-react'

export function NotFound() {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
			<SearchXIcon className="w-14 h-14 text-[#2e2e2e] mb-4" />
			<h1 className="text-4xl font-bold text-white mb-2">404</h1>
			<p className="text-[#a0a0a0] mb-6 max-w-sm">
				This page doesn't exist or has been removed.
			</p>
			<Link
				to="/"
				className="inline-flex items-center gap-2 bg-[#2557a7] hover:bg-[#1e4a8f] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors no-underline"
			>
				<HomeIcon className="w-4 h-4" />
				Back to Jobs
			</Link>
		</div>
	)
}

export function ErrorBoundary({ error }: { error: Error }) {
	const router = useRouter()
	const message =
		error?.message?.includes('Unauthorized')
			? 'You need to be signed in to view this page.'
			: (error?.message ?? 'Something went wrong.')

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
			<AlertCircleIcon className="w-14 h-14 text-red-500/60 mb-4" />
			<h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
			<p className="text-[#a0a0a0] mb-6 max-w-sm text-sm">{message}</p>
			<div className="flex gap-3">
				<button
					type="button"
					onClick={() => router.invalidate()}
					className="inline-flex items-center gap-2 bg-[#242424] hover:bg-[#2e2e2e] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors border border-[#2e2e2e]"
				>
					<RefreshCwIcon className="w-4 h-4" />
					Try Again
				</button>
				<Link
					to="/"
					className="inline-flex items-center gap-2 bg-[#2557a7] hover:bg-[#1e4a8f] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors no-underline"
				>
					<HomeIcon className="w-4 h-4" />
					Back to Jobs
				</Link>
			</div>
		</div>
	)
}
