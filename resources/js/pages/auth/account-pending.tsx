import { Head, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { login, logout } from '@/routes';

type Props = {
    message?: string;
};

export default function AccountPending({ message }: Props) {
    return (
        <AuthLayout
            title="Account Pending Approval"
            description="Your account is awaiting review"
        >
            <Head title="Account Pending" />

            <div className="mx-auto w-full max-w-md">
                <div className="grid gap-6 rounded-lg border p-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <svg
                                className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Account Pending Approval
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {message ||
                                    'Your account is pending approval. Please wait for a super admin to review your registration.'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                            Once your account is approved, you will be able to access
                            all features of the platform. You will receive a
                            notification when your account status changes.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            router.post(logout().url, {}, {
                                onSuccess: () => {
                                    window.location.href = login().url;
                                },
                            });
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

