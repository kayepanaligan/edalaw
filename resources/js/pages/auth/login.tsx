import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
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
    const { resolvedAppearance } = useAppearance();
    const form = useForm({
        email: '',
        password: '',
        remember: false,
        recaptcha_token: '',
    });
    const formRef = useRef<HTMLFormElement>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [recaptchaError, setRecaptchaError] = useState<string>('');
    const [recaptchaToken, setRecaptchaToken] = useState<string>('');
    const [isRecaptchaReady, setIsRecaptchaReady] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Keep form data in sync with token state
    useEffect(() => {
        if (recaptchaToken) {
            form.setData('recaptcha_token', recaptchaToken);
        }
    }, [recaptchaToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRecaptchaError('');

        let tokenToSend = '';

        if (recaptchaSiteKey) {
            if (!isRecaptchaReady || !recaptchaRef.current) {
                setRecaptchaError('reCAPTCHA is still loading. Please wait a moment and try again.');
                return;
            }

            tokenToSend = recaptchaToken || recaptchaRef.current?.getValue() || form.data.recaptcha_token || '';

            if (!tokenToSend || tokenToSend.trim() === '') {
                setRecaptchaError('Please complete the reCAPTCHA verification.');
                return;
            }
        }

        // Submit with explicit payload so recaptcha_token is always included (avoids form state timing issues)
        const payload = {
            email: form.data.email,
            password: form.data.password,
            remember: form.data.remember,
            recaptcha_token: tokenToSend,
        };

        setIsSubmitting(true);
        router.post(store().url, payload, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
            onError: (errors: Record<string, string>) => {
                form.setError({ ...form.errors, ...errors } as typeof form.errors);
                if (errors.recaptcha) {
                    setRecaptchaToken('');
                    form.setData('recaptcha_token', '');
                    recaptchaRef.current?.reset();
                }
                if (errors.otp || (Object.keys(errors).length === 0 && !errors.recaptcha)) {
                    setTimeout(() => {
                        window.location.href = '/otp-verification';
                    }, 100);
                }
            },
            onSuccess: () => {
                setRecaptchaToken('');
                form.setData('recaptcha_token', '');
                recaptchaRef.current?.reset();
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
                                theme={resolvedAppearance}
                                onLoad={() => {
                                    // reCAPTCHA widget has loaded
                                    setIsRecaptchaReady(true);
                                }}
                                onChange={(token) => {
                                    if (token) {
                                        setRecaptchaError('');
                                        // Store token in state and form data
                                        setRecaptchaToken(token);
                                        form.setData('recaptcha_token', token);
                                        setIsRecaptchaReady(true);
                                    } else {
                                        // Token was cleared
                                        setRecaptchaToken('');
                                        form.setData('recaptcha_token', '');
                                    }
                                }}
                                onExpired={() => {
                                    setRecaptchaError('reCAPTCHA expired. Please verify again.');
                                    setRecaptchaToken('');
                                    form.setData('recaptcha_token', '');
                                    setIsRecaptchaReady(false);
                                    // Reset the widget so user can try again
                                    recaptchaRef.current?.reset();
                                }}
                                onError={() => {
                                    setRecaptchaError('reCAPTCHA error. Please try again.');
                                    setRecaptchaToken('');
                                    form.setData('recaptcha_token', '');
                                    setIsRecaptchaReady(false);
                                }}
                            />
                        ) : (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-900/10">
                                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                    <strong>Note:</strong> reCAPTCHA is not configured. Please contact the administrator if you encounter login issues.
                                </p>
                            </div>
                        )}
                    </div>

                    {recaptchaError && (
                        <div className="text-sm text-red-600">{recaptchaError}</div>
                    )}
                    <InputError message={(form.errors as Record<string, string>).recaptcha} />

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={form.processing || isSubmitting}
                        data-test="login-button"
                    >
                        {(form.processing || isSubmitting) && <Spinner />}
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
