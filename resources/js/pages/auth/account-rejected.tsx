import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/account-appeal';

type Props = {
    message?: string;
    rejection_reason?: string | null;
    hasExistingAppeal?: boolean;
    existingAppeal?: {
        id: number;
        status: string;
        reason: string;
        submitted_at: string | null;
        reviewed_at: string | null;
        decision_notes: string | null;
    } | null;
};

export default function AccountRejected({
    message,
    rejection_reason,
    hasExistingAppeal = false,
    existingAppeal = null,
}: Props) {
    const [showAppealForm, setShowAppealForm] = useState(!hasExistingAppeal);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        reason: '',
        documents: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setShowAppealForm(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        form.setData('documents', files);
    };

    return (
        <AuthLayout
            title="Account Rejected"
            description="Your account application has been rejected"
        >
            <Head title="Account Rejected" />

            <div className="mx-auto w-full max-w-md">
                <div className="grid gap-6 rounded-lg border p-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <svg
                                className="h-8 w-8 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Account Rejected
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {message ||
                                    'Your account has been rejected. You may submit an appeal if you believe this was an error.'}
                            </p>
                        </div>
                    </div>

                    {rejection_reason && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-red-800 dark:text-red-400">
                                    Reason for Rejection:
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    {rejection_reason}
                                </p>
                            </div>
                        </div>
                    )}

                    {hasExistingAppeal && existingAppeal && (
                        <div className="rounded-lg bg-muted p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Appeal Status:
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                            existingAppeal.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                : existingAppeal.status ===
                                                  'approved'
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        }`}
                                    >
                                        {existingAppeal.status.charAt(0).toUpperCase() +
                                            existingAppeal.status.slice(1)}
                                    </span>
                                </div>
                                {existingAppeal.submitted_at && (
                                    <p className="text-xs text-muted-foreground">
                                        Submitted:{' '}
                                        {new Date(
                                            existingAppeal.submitted_at,
                                        ).toLocaleString()}
                                    </p>
                                )}
                                {existingAppeal.reviewed_at && (
                                    <p className="text-xs text-muted-foreground">
                                        Reviewed:{' '}
                                        {new Date(
                                            existingAppeal.reviewed_at,
                                        ).toLocaleString()}
                                    </p>
                                )}
                                {existingAppeal.decision_notes && (
                                    <div className="mt-2">
                                        <p className="text-xs font-medium">
                                            Decision Notes:
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {existingAppeal.decision_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {showAppealForm && !hasExistingAppeal && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reason">
                                    Reason for Appeal{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="reason"
                                    name="reason"
                                    required
                                    minLength={10}
                                    maxLength={2000}
                                    rows={5}
                                    placeholder="Please explain why you believe your account should be reconsidered..."
                                    value={form.data.reason}
                                    onChange={(e) =>
                                        form.setData('reason', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.reason} />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 10 characters, maximum 2000
                                    characters.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documents">
                                    Supporting Documents (Proofs){' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="documents"
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    required
                                />
                                <InputError message={form.errors.documents} />
                                <p className="text-xs text-muted-foreground">
                                    You must upload at least 2 files (maximum 5 files) as proof. Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG. Maximum 5MB per file.
                                </p>
                                {form.data.documents.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs font-medium">
                                            Selected files ({form.data.documents.length}):
                                        </p>
                                        {form.data.documents.map((file, index) => (
                                            <p key={index} className="text-xs text-muted-foreground">
                                                • {file.name}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.processing || form.data.documents.length < 2}
                            >
                                {form.processing && <Spinner />}
                                Submit Appeal
                            </Button>
                            {form.data.documents.length < 2 && (
                                <p className="text-xs text-center text-destructive">
                                    Please upload at least 2 supporting documents.
                                </p>
                            )}
                        </form>
                    )}

                    {!showAppealForm && !hasExistingAppeal && (
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
                            <p className="text-sm text-green-800 dark:text-green-400">
                                Your appeal has been submitted successfully. You
                                will be notified when a super admin reviews your
                                appeal.
                            </p>
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            window.location.href = login();
                        }}
                        className="w-full"
                    >
                        Return to Login
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}

