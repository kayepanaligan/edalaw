import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    verifyUrl: string;
    csrfToken: string;
};

export default function EnterTunnelToken({ verifyUrl, csrfToken }: Props) {
    const [value, setValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { props } = usePage();
    const errors = (props.errors as Record<string, string> | undefined) ?? {};

    const handleSubmit = (e: React.FormEvent) => {
        setIsSubmitting(true);
        (e.target as HTMLFormElement).submit();
    };

    return (
        <AuthLayout
            title="Join as inmate"
            description="Enter the 8-character code you received to join your scheduled visit"
        >
            <Head title="Join as inmate" />

            <div className="mx-auto w-full max-w-md">
                <form
                    method="POST"
                    action={verifyUrl}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
                    <input type="hidden" name="_token" value={csrfToken} />
                    <div className="grid gap-6 rounded-lg border p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="token_or_url">Inmate tunnel code</Label>
                            <Input
                                id="token_or_url"
                                name="token_or_url"
                                type="text"
                                required
                                autoFocus
                                minLength={8}
                                maxLength={32}
                                placeholder="e.g. AB12CD34 (8-character code)"
                                className="font-mono tracking-widest"
                                value={value}
                                onChange={(e) => setValue(e.target.value.replace(/\s/g, '').slice(0, 32))}
                            />
                            <InputError
                                message={
                                    Array.isArray(errors.token_or_url)
                                        ? errors.token_or_url[0]
                                        : errors.token_or_url
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner /> : null}
                            {isSubmitting ? 'Verifying...' : 'Continue'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
