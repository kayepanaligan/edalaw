import { Head, router, useForm } from '@inertiajs/react';

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
import { REGEXP_ONLY_DIGITS } from 'input-otp';

type Props = {
    email?: string;
    contact_number?: string | null;
    verify_url?: string;
    resend_url?: string;
    title?: string;
    description?: string;
    sent_to_label?: string;
    sent_to_value?: string | null;
    warning?: string;
};

export default function OtpVerification({
    email,
    contact_number,
    verify_url = '/otp-verification/verify',
    resend_url = '/otp-verification/resend',
    title = 'Verify OTP',
    description = 'Enter the 6-digit OTP sent to your contact number',
    sent_to_label,
    sent_to_value,
    warning,
}: Props) {
    const form = useForm({
        otp: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(verify_url, {
            preserveScroll: true,
        });
    };

    const handleResend = () => {
        router.post(resend_url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                form.setData('otp', '');
            },
        });
    };

    return (
        <AuthLayout
            title={title}
            description={description}
        >
            <Head title="OTP Verification" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6 rounded-lg border p-6">
                    {warning && (
                        <Alert variant="destructive">
                            <AlertTitle>OTP delivery issue</AlertTitle>
                            <AlertDescription>{warning}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                        {sent_to_value ? (
                            <p className="text-sm font-medium">
                                {sent_to_label ? `${sent_to_label}: ${sent_to_value}` : sent_to_value}
                            </p>
                        ) : contact_number ? (
                            <p className="text-sm font-medium">{contact_number}</p>
                        ) : null}
                        {email && (
                            <p className="text-xs text-muted-foreground">
                                Account: {email}
                            </p>
                        )}
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.processing || form.data.otp.length !== 6}
                    >
                        {form.processing && <Spinner />}
                        Verify OTP
                    </Button>

                    <div className="text-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResend}
                            disabled={form.processing}
                            className="text-sm"
                        >
                            Resend OTP
                        </Button>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                        <p>Didn't receive the OTP? Check your contact number or try resending.</p>
                        <p className="mt-1">OTP expires in 10 minutes.</p>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}

