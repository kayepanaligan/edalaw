import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { LoaderCircle } from 'lucide-react';

type Props = { status?: string };

export default function ForgotPasswordOtp({ status }: Props) {
    const form = useForm({ email: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/password/forgot', { preserveScroll: true });
    };

    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email. We will send an OTP to your registered contact number."
        >
            <Head title="Forgot password" />
            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
            )}
            <div className="space-y-6">
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                placeholder="email@example.com"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                            <InputError message={form.errors.email} />
                        </div>
                        <Button type="submit" className="w-full" disabled={form.processing}>
                            {form.processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Send OTP to my contact number
                        </Button>
                    </div>
                </form>
                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
