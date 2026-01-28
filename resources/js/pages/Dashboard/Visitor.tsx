import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Visitor',
    },
];

export default function VisitorDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visitor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Visitor Dashboard</h1>
                        <p className="text-muted-foreground">View your information and requests</p>
                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg">My Profile</CardTitle>
                            <CardDescription>View and update your profile information</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <Link href="/visitor/schedule" className="block">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-5" />
                                    <CardTitle className="text-lg">Schedule Management</CardTitle>
                                </div>
                                <CardDescription>Apply for visit schedules and manage appointments</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg">My Requests</CardTitle>
                            <CardDescription>View status of your requests</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="relative z-10 flex h-full items-center justify-center p-8">
                        <p className="text-center text-muted-foreground">Visitor Content Area</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

