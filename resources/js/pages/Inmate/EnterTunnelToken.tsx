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
            title="Inmate tunnel"
            description="Enter the inmate tunnel link or token you received to join your scheduled visit"
        >
            <Head title="Inmate tunnel" />

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
                            <Label htmlFor="token_or_url">Link or token</Label>
                            <Input
                                id="token_or_url"
                                name="token_or_url"
                                type="text"
                                required
                                autoFocus
                                placeholder="Paste the full link or token"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
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
