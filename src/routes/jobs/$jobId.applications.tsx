import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import {
	queryOptions,
	useSuspenseQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { getJobWithApplicationFn } from "#/utils/job/job.functions";
import { updateApplicationStatusFn } from "#/utils/application/application.functions";
import { getRole } from "#/utils/user/users.functions";
import { ArrowLeftIcon, FileTextIcon, PhoneIcon, MailIcon } from "lucide-react";

type AppStatus = "Pending" | "Reviewed" | "Accepted" | "Rejected";

const jobApplicationsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["jobs", id, "applications"],
		queryFn: () => getJobWithApplicationFn({ data: id }),
	});

export const Route = createFileRoute("/jobs/$jobId/applications")({
	loader: async ({ context: { queryClient }, params: { jobId } }) => {
		const role = await getRole();
		if (!role) throw redirect({ to: "/sign-in" });
		if (role !== "Employer") throw redirect({ to: "/" });
		await queryClient.ensureQueryData(jobApplicationsQueryOptions(jobId));
	},
	component: ApplicationsPage,
});

const statusColors: Record<AppStatus, string> = {
	Pending: "text-yellow-500 border-yellow-500/40 bg-yellow-500/10",
	Reviewed: "text-blue-500 border-blue-500/40 bg-blue-500/10",
	Accepted: "text-green-500 border-green-500/40 bg-green-500/10",
	Rejected: "text-destructive border-destructive/40 bg-destructive/10",
};

const scoreColor = (score: number) => {
	if (score >= 75) return "text-green-500";
	if (score >= 50) return "text-yellow-500";
	return "text-destructive";
};

function ApplicationsPage() {
	const { jobId } = Route.useParams();
	const { data: job } = useSuspenseQuery(jobApplicationsQueryOptions(jobId));
	const queryClient = useQueryClient();
	const [updating, setUpdating] = useState<string | null>(null);

	if (!job) return null;

	async function handleStatusChange(applicationId: string, status: AppStatus) {
		setUpdating(applicationId);
		try {
			await updateApplicationStatusFn({ data: { applicationId, status } });
			queryClient.invalidateQueries({
				queryKey: ["jobs", jobId, "applications"],
			});
		} finally {
			setUpdating(null);
		}
	}

	return (
		<div className="px-4 py-8 md:px-12 md:py-12 flex flex-col gap-8 max-w-4xl">
			<Link
				to="/jobs/$jobId"
				params={{ jobId }}
				className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit transition-colors"
			>
				<ArrowLeftIcon className="h-4 w-4" />
				Back to job
			</Link>

			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					Applicants
				</h1>
				<p className="text-sm text-muted-foreground">
					{job.title} · {job.applications.length} applicant
					{job.applications.length !== 1 ? "s" : ""}
				</p>
			</div>

			{job.applications.length === 0 ? (
				<div className="border border-border bg-muted p-8 text-center">
					<p className="text-sm text-muted-foreground">No applications yet.</p>
				</div>
			) : (
				<div className="flex flex-col divide-y divide-border">
					{job.applications.map((app) => (
						<div key={app.id} className="flex flex-col gap-4 py-6">
							<div className="flex items-start justify-between gap-4">
								{/* Applicant info */}
								<div className="flex flex-col gap-2">
									<p className="font-semibold text-foreground">
										{app.user.name}
									</p>
									<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
										<a
											href={`mailto:${app.user.email}`}
											className="flex items-center gap-1 hover:text-foreground transition-colors"
										>
											<MailIcon className="h-3 w-3" />
											{app.user.email}
										</a>
										{app.user.phone && (
											<span className="flex items-center gap-1">
												<PhoneIcon className="h-3 w-3" />
												{app.user.phone}
											</span>
										)}
									</div>
									{app.resume?.url && (
										<a
											href={app.resume.url}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-1 text-xs text-primary hover:underline w-fit"
										>
											<FileTextIcon className="h-3 w-3" />
											View Resume
										</a>
									)}
								</div>

								{/* Score + status */}
								<div className="flex flex-col items-end gap-3 shrink-0">
									{app.matchScore !== null && (
										<div className="flex flex-col items-end gap-0.5">
											<span
												className={`text-2xl font-bold ${scoreColor(app.matchScore ?? 0)}`}
											>
												{app.matchScore?.toFixed(0)}%
											</span>
											<span className="text-xs text-muted-foreground">
												AI match
											</span>
										</div>
									)}
									<select
										value={app.status}
										disabled={updating === app.id}
										onChange={(e) =>
											handleStatusChange(app.id, e.target.value as AppStatus)
										}
										className="input-field input-field-sm py-1.5! text-xs cursor-pointer"
									>
										{(
											[
												"Pending",
												"Reviewed",
												"Accepted",
												"Rejected",
											] as AppStatus[]
										).map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Status badge */}
							<div className="flex items-center gap-2">
								<span
									className={`text-xs font-semibold px-2 py-0.5 border ${statusColors[app.status as AppStatus]}`}
								>
									{app.status}
								</span>
								<span className="text-xs text-muted-foreground">
									Applied {new Date(app.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
