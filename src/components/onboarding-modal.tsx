import { useState } from "react";
import { BriefcaseIcon, UserIcon } from "lucide-react";
import { updateUserRole } from "#/utils/user/users.functions";

interface OnboardingModalProps {
	open: boolean;
	onComplete: () => void;
}

export default function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
	const [step, setStep] = useState<"role" | "employer">("role");
	const [loading, setLoading] = useState(false);
	const [companyName, setCompanyName] = useState("");
	const [companySite, setCompanySite] = useState("");
	const [error, setError] = useState("");

	if (!open) return null;

	async function handleEmployeeSelect() {
		setLoading(true);
		try {
			await updateUserRole({ data: { role: "Employee" } });
			onComplete();
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	async function handleEmployerSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!companyName.trim() || !companySite.trim()) {
			setError("Both fields are required.");
			return;
		}
		setLoading(true);
		setError("");
		try {
			await updateUserRole({ data: { role: "Employer", companyName, companySite } });
			onComplete();
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-md border border-border bg-card p-8">
				{step === "role" ? (
					<>
						<div className="mb-6">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Bayrozgaar</h2>
							<p className="mt-1 text-sm text-muted-foreground">Tell us who you are to get started.</p>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setStep("employer")}
								className="flex flex-col items-center gap-3 border border-border bg-muted p-6 transition-colors hover:border-primary hover:bg-accent cursor-pointer"
							>
								<BriefcaseIcon className="h-8 w-8 text-primary" />
								<span className="font-semibold text-sm text-foreground">Employer</span>
								<span className="text-xs text-muted-foreground text-center">I want to post jobs and hire talent</span>
							</button>

							<button
								type="button"
								onClick={handleEmployeeSelect}
								disabled={loading}
								className="flex flex-col items-center gap-3 border border-border bg-muted p-6 transition-colors hover:border-primary hover:bg-accent cursor-pointer disabled:opacity-50"
							>
								<UserIcon className="h-8 w-8 text-primary" />
								<span className="font-semibold text-sm text-foreground">Employee</span>
								<span className="text-xs text-muted-foreground text-center">I'm looking for a job</span>
							</button>
						</div>

						{error && <p className="mt-3 text-xs text-destructive">{error}</p>}
					</>
				) : (
					<>
						<div className="mb-6">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">Company Details</h2>
							<p className="mt-1 text-sm text-muted-foreground">Tell us about your company so candidates can find you.</p>
						</div>

						<form onSubmit={handleEmployerSubmit} className="flex flex-col gap-6">
							<div className="form-item">
								<label htmlFor="companyName" className="form-label">Company Name</label>
								<input
									id="companyName"
									className="input-field input-field-sm"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
									placeholder="Acme Corp"
								/>
							</div>

							<div className="form-item">
								<label htmlFor="companySite" className="form-label">Company Website</label>
								<input
									id="companySite"
									className="input-field input-field-sm"
									value={companySite}
									onChange={(e) => setCompanySite(e.target.value)}
									placeholder="https://acme.com"
								/>
							</div>

							{error && <p className="text-xs text-destructive">{error}</p>}

							<div className="flex gap-3 pt-2">
								<button
									type="button"
									onClick={() => { setStep("role"); setError(""); }}
									className="btn-secondary flex-1"
								>
									Back
								</button>
								<button
									type="submit"
									disabled={loading}
									className="btn-primary flex-1 disabled:opacity-50"
								>
									{loading ? "Saving..." : "Get Started"}
								</button>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
