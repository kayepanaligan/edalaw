import { Head, usePage, useForm } from '@inertiajs/react';
import { KeyRound, Mail, Smartphone } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    email?: string | null;
    sentAt?: string | null;
    errors?: {
        email?: string;
        otp?: string;
    };
    success?: string;
};

export default function UnblockOTP({ email, sentAt, errors = {}, success }: Props) {
    const [countdown, setCountdown] = useState<number>(0);
    const page = usePage();
    
    // Get flash messages from Inertia (with type casting to avoid TS errors)
    const flashSuccess = (page.props.flash as any)?.success as string | undefined;
    const flashError = (page.props.flash as any)?.error as string | undefined;

    // Start countdown if OTP was already sent
    useEffect(() => {
        if (sentAt && countdown === 0) {
            // Calculate time remaining since OTP was sent
            const sentTime = new Date(sentAt).getTime();
            const now = new Date().getTime();
            const elapsedSeconds = Math.floor((now - sentTime) / 1000);
            const remainingSeconds = 120 - elapsedSeconds;
            
            if (remainingSeconds > 0) {
                setCountdown(remainingSeconds);
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                
                return () => clearInterval(interval);
            }
        }
    }, [sentAt]);

    const { data, setData, post, processing, reset } = useForm({
        email: email || '',
        otp: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/auth/unblock-otp/verify', {
            onSuccess: () => {
                reset('otp');
            },
        });
    }

    function handleResend() {
        if (countdown > 0) return;

        post('/auth/unblock-otp/send', {
            preserveScroll: true,
            onSuccess: () => {
                setCountdown(120); // 2 minutes in seconds
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            },
        });
    }

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <AuthLayout title="Verify Account Owner" description="Enter the OTP sent to your registered mobile number">
            <Head title="Account Unblock - OTP Verification" />
            <div className="mx-auto w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-xl">Account Security Verification</CardTitle>
                        <CardDescription>
                            A login was blocked due to an active session on another device. Verify you're the account owner to proceed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(success || flashSuccess) && (
                            <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                                {success || flashSuccess}
                            </div>
                        )}

                        {(flashError || errors.email || errors.otp) && (
                            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400">
                                {flashError || errors.email || errors.otp}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="pl-9"
                                        disabled={processing}
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP Code</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={data.otp}
                                        onChange={(e) => setData('otp', e.target.value.replace(/[^0-9]/g, ''))}
                                        className="pl-9 text-center text-lg tracking-widest"
                                        disabled={processing}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.otp && <p className="text-xs text-red-500">{errors.otp}</p>}
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Smartphone className="h-3 w-3" />
                                    Enter the 6-digit code sent to your registered mobile number
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Verifying...' : 'Verify & Unblock Account'}
                            </Button>
                        </form>

                        <div className="mt-4 space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResend}
                                disabled={processing || countdown > 0}
                                className="w-full"
                            >
                                {countdown > 0 ? `Resend OTP in ${formatTime(countdown)}` : 'Resend OTP Code'}
                            </Button>
                            {sentAt && countdown === 0 && (
                                <p className="text-xs text-center text-muted-foreground">
                                    Last OTP sent at {new Date(sentAt).toLocaleTimeString()}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 text-center">
                            <Button variant="link" asChild className="text-sm">
                                <a href="/login">← Back to Login</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
