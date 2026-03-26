import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ShieldAlert, Unlock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    email?: string | null;
    loginUrl?: string;
};

export default function ConcurrentLoginWarning({ email, loginUrl = '/login' }: Props) {
    return (
        <AuthLayout title="Login blocked" description="Your account is already in use elsewhere">
            <Head title="Login Blocked - Already Logged In" />
            <div className="mx-auto w-full max-w-lg">
                <Card className="border-amber-500/50 bg-amber-500/5">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <ShieldAlert className="h-6 w-6" />
                            <CardTitle>Currently logged in on another device</CardTitle>
                        </div>
                        <CardDescription>
                            A login attempt was made for {email ? <strong>{email}</strong> : 'your account'} while this account is already logged in on a different device or browser.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
                            <p className="font-medium flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                This login attempt was blocked for your security.
                            </p>
                            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                                <li>If you believe this is a mistake, please contact the administrator.</li>
                                <li>This attempt has been monitored and tracked.</li>
                                <li>The super admin and your account have been notified of this event.</li>
                            </ul>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            To log in from this device, first log out from the other device or wait for the other session to expire. If you did not try to log in, secure your account and contact support.
                        </p>
                        
                        {/* Owner Bypass Section */}
                        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <Unlock className="h-5 w-5" />
                                <h3 className="font-semibold">Are you the account owner?</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Verify your identity via OTP to bypass this block and log in from this device.
                            </p>
                            <Button asChild variant="outline" className="w-full border-blue-500/50 text-blue-700 hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-950/30">
                                <Link href={`/auth/unblock-otp${email ? `?email=${encodeURIComponent(email)}` : ''}`}>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Verify with OTP (Owner Bypass)
                                </Link>
                            </Button>
                        </div>
                        
                        <Button asChild className="w-full">
                            <Link href={loginUrl}>Back to login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
