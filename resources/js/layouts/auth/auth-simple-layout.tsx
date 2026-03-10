import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Link } from '@inertiajs/react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-4 flex items-center justify-center gap-4 md:gap-8">
                                <img
                                    src="/cids_logo.png"
                                    alt="CIDS Logo"
                                    className="h-20 w-auto object-contain md:h-35"
                                />
                                <img
                                    src="/dssc_logo.png"
                                    alt="DSSC Logo"
                                    className="h-18 w-auto object-contain md:h-30"
                                />
                                <img
                                    src="/edalaw_logo.png"
                                    alt="EDALaw Logo"
                                    className="h-18 w-auto object-contain md:h-30"
                                />
                                <img
                                    src="/bjmp_logo.png"
                                    alt="BJMP Logo"
                                    className="h-18 w-auto object-contain md:h-30"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
