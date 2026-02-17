import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export default function VerifyOtpReset() {
    const form = useForm({ otp: '' });

    return (
        <AuthLayout
            title="Verify OTP"
            description="Enter the 6-digit OTP sent to your contact number"
        >
            <Head title="Verify OTP – Reset Password" />

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post('/password/verify-otp', { preserveScroll: true });
                }}
                className="flex flex-col gap-6"
            >
                <div className="grid gap-6 rounded-lg border p-6">
                    <div className="space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">
                            We sent a 6-digit OTP to your registered contact number. Enter it below to continue.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Label htmlFor="otp" className="text-center">
                            Enter OTP
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

                    <Button type="submit" className="w-full" disabled={form.processing || form.data.otp.length !== 6}>
                        {form.processing && <Spinner className="mr-2 h-4 w-4" />}
                        Verify and continue
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
