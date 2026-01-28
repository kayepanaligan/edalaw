import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, User } from 'lucide-react';

type Request = {
    id: number;
    scheduled_date: string;
    scheduled_time: string | null;
    visit_type: 'virtual' | 'physical';
    inmate_first_name: string;
    inmate_middle_name: string | null;
    inmate_last_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    notes: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    requests: Request[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Requests',
    },
];

export default function RequestManagement({ requests }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive">Rejected</Badge>
                );
            case 'completed':
                return (
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                        Completed
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                        Pending
                    </Badge>
                );
        }
    };

    const getVisitTypeBadge = (type: string) => {
        return type === 'virtual' ? (
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                Virtual
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
                Physical
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Request Management</h1>
                        <p className="text-muted-foreground">View and manage all your visit requests</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>My Requests</CardTitle>
                        <CardDescription>Track the status of all your visit schedule requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No requests found.</p>
                                <p className="text-sm mt-2">Submit a visit schedule request to see it here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="rounded-lg border p-6 space-y-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="size-5 text-muted-foreground" />
                                                    <div>
                                                        <span className="font-medium">
                                                            {new Date(request.scheduled_date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                        {request.scheduled_time && (
                                                            <span className="ml-2 text-sm text-muted-foreground flex items-center gap-1">
                                                                <Clock className="size-3" />
                                                                {request.scheduled_time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User className="size-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        <strong>Inmate:</strong> {request.inmate_first_name} {request.inmate_middle_name} {request.inmate_last_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {getStatusBadge(request.status)}
                                                {getVisitTypeBadge(request.visit_type)}
                                            </div>
                                        </div>
                                        {request.notes && (
                                            <div className="text-sm text-muted-foreground border-t pt-3">
                                                <strong>Notes:</strong> {request.notes}
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                                            <span>Created: {new Date(request.created_at).toLocaleString()}</span>
                                            <span>Updated: {new Date(request.updated_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}



