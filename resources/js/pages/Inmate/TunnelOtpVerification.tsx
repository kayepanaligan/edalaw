import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    tunnelToken: string;
    verifyUrl: string;
};

export default function TunnelOtpVerification({ tunnelToken, verifyUrl }: Props) {
    const form = useForm({
        otp: '',
    });

    const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
    const [lastResendTime, setLastResendTime] = useState<number | null>(null);

    useEffect(() => {
        // Check if there's a stored last resend time in sessionStorage
        const storedTime = sessionStorage.getItem('tunnel_otp_last_resend_time');
        if (storedTime) {
            const elapsed = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
            const remaining = Math.max(0, 120 - elapsed); // 2 minutes = 120 seconds
            if (remaining > 0) {
                setCooldownSeconds(remaining);
            }
        }

        // Countdown timer
        const interval = setInterval(() => {
            setCooldownSeconds((prev) => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(verifyUrl, {
            preserveScroll: true,
        });
    };

    const handleResend = () => {
        if (cooldownSeconds > 0) return; // Prevent clicking during cooldown
        
        router.post(`/inmate/tunnel/${tunnelToken}/otp/resend`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                form.setData('otp', '');
                // Store the resend time and start cooldown
                const now = Date.now();
                sessionStorage.setItem('tunnel_otp_last_resend_time', now.toString());
                setLastResendTime(now);
                setCooldownSeconds(120); // 2 minutes cooldown
            },
        });
    };

    const formatCooldownTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AuthLayout
            title="Jail Officer Verification Required"
            description="Enter the OTP code sent to the assigned jail officer"
        >
            <Head title="Tunnel Access Verification" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6 rounded-lg border p-6">
                    <Alert variant="default" className="border-orange-500 bg-orange-50">
                        <AlertTitle className="text-orange-800">Security Verification</AlertTitle>
                        <AlertDescription className="text-orange-700">
                            An OTP has been sent to the assigned jail officer. Please contact them to get the code before proceeding.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">
                            Enter the 6-digit OTP code to verify your tunnel access
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Label htmlFor="otp" className="text-center">
                            OTP Code
                        </Label>
                        <InputOTP
                            id="otp"
                            maxLength={6}
                            value={form.data.otp}
                            onChange={(value) => form.setData('otp', value)}
                            disabled={form.processing}
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <InputError message={form.errors.otp} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        disabled={form.processing || form.data.otp.length !== 6}
                    >
                        {form.processing && <Spinner />}
                        Verify and Join Call
                    </Button>

                    <div className="text-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResend}
                            disabled={form.processing || cooldownSeconds > 0}
                            className="text-sm"
                        >
                            {cooldownSeconds > 0 ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Resend in {formatCooldownTime(cooldownSeconds)}
                                </>
                            ) : (
                                'Resend OTP to Jail Officer'
                            )}
                        </Button>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                        <p>This code will be sent to the jail officer assigned to monitor your session.</p>
                        <p className="mt-1">OTP expires in 10 minutes.</p>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
