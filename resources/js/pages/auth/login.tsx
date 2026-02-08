import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    recaptchaSiteKey?: string;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
    recaptchaSiteKey,
}: Props) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
        recaptcha_token: '',
    });
    const formRef = useRef<HTMLFormElement>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [recaptchaError, setRecaptchaError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRecaptchaError('');

        if (recaptchaSiteKey) {
            const token = recaptchaRef.current?.getValue();
            if (!token) {
                setRecaptchaError('Please complete the reCAPTCHA verification.');
                return;
            }
            form.setData('recaptcha_token', token);
        }

        form.post(store().url, {
            preserveScroll: true,
            onFinish: () => {
                form.setData('recaptcha_token', '');
                recaptchaRef.current?.reset();
            },
            onError: (errors) => {
                // If OTP is required (visitor login), redirect to OTP verification page
                // Check if session has login.user_id (set by backend when OTP is sent)
                if (errors.otp || Object.keys(errors).length === 0) {
                    // Check session for OTP requirement
                    setTimeout(() => {
                        window.location.href = '/otp-verification';
                    }, 100);
                }
            },
        });
    };

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <div className="mx-auto w-full max-w-md">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-6 rounded-lg border p-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="email@example.com"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                        />
                        <InputError message={form.errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={form.data.remember}
                            onCheckedChange={(checked) => form.setData('remember', checked === true)}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <div className="flex justify-center">
                        {recaptchaSiteKey ? (
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={recaptchaSiteKey}
                                onChange={(token) => {
                                    if (token) {
                                        setRecaptchaError('');
                                        form.setData('recaptcha_token', token);
                                    }
                                }}
                                onExpired={() => {
                                    setRecaptchaError('reCAPTCHA expired. Please verify again.');
                                    form.setData('recaptcha_token', '');
                                }}
                                onError={() => {
                                    setRecaptchaError('reCAPTCHA error. Please try again.');
                                    form.setData('recaptcha_token', '');
                                }}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">reCAPTCHA not configured</p>
                        )}
                    </div>

                    {recaptchaError && (
                        <div className="text-sm text-red-600">{recaptchaError}</div>
                    )}
                    <InputError message={form.errors.recaptcha} />

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={form.processing}
                        data-test="login-button"
                    >
                        {form.processing && <Spinner />}
                        Log in
                    </Button>
                </div>

                {canRegister && (
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <TextLink href={register()} tabIndex={5}>
                            Sign up
                        </TextLink>
                    </div>
                )}
                </form>
            </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
