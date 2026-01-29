import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    contact_number: string | null;
    dob: string | null;
    gender: string | null;
    street: string | null;
    brgy: string | null;
    barangay: string | null;
    municipality: string | null;
    province: string | null;
    postal_code: string | null;
    role: string;
    role_slug: string;
    approval_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    last_login_at: string | null;
    last_logout_at: string | null;
    last_ip_address: string | null;
    last_user_agent: string | null;
    is_active: boolean;
    minutes_since_logout: number | null;
};

type Props = {
    users: User[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard/super-admin',
    },
    {
        title: 'Users',
    },
];

export default function UserManagement({ users }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    const handleApprove = (userId: number) => {
        setProcessing(userId);
        router.post(
            admin.users.approve(userId).url,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(null),
            }
        );
    };

    const handleReject = (userId: number) => {
        setProcessing(userId);
        router.post(
            admin.users.reject(userId).url,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(null),
            }
        );
    };

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
            default:
                return (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                        Pending
                    </Badge>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">User Management</h1>
                        <p className="text-muted-foreground">Approve or reject user account requests</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage user account approvals and rejections</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No users found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-4 font-medium">Name</th>
                                                <th className="text-left p-4 font-medium">Email</th>
                                                <th className="text-left p-4 font-medium">Contact</th>
                                                <th className="text-left p-4 font-medium">DOB</th>
                                                <th className="text-left p-4 font-medium">Gender</th>
                                                <th className="text-left p-4 font-medium">Address</th>
                                                <th className="text-left p-4 font-medium">Role</th>
                                                <th className="text-left p-4 font-medium">Session Activity</th>
                                                <th className="text-left p-4 font-medium">Status</th>
                                                <th className="text-left p-4 font-medium">Created At</th>
                                                <th className="text-right p-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id} className="border-b hover:bg-muted/50">
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {user.first_name} {user.middle_name} {user.last_name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">{user.email}</td>
                                                    <td className="p-4 text-sm">
                                                        {user.contact_number || '-'}
                                                    </td>
                                                    <td className="p-4 text-sm">
                                                        {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="p-4 text-sm capitalize">{user.gender || '-'}</td>
                                                    <td className="p-4">
                                                        <div className="text-sm max-w-xs">
                                                            {user.street && (
                                                                <div>{user.street}</div>
                                                            )}
                                                            {(user.barangay || user.brgy) && user.municipality && user.province && (
                                                                <div className="text-muted-foreground">
                                                                    {user.barangay || user.brgy}, {user.municipality}, {user.province}
                                                                </div>
                                                            )}
                                                            {user.postal_code && (
                                                                <div className="text-muted-foreground">{user.postal_code}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant="secondary">{user.role}</Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <span
                                                                className={`inline-flex items-center w-max rounded-full px-2 py-0.5 font-medium ${
                                                                    user.is_active
                                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                        : 'bg-muted text-muted-foreground'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`mr-1 inline-block size-2 rounded-full ${
                                                                        user.is_active
                                                                            ? 'bg-emerald-500'
                                                                            : 'bg-muted-foreground/40'
                                                                    }`}
                                                                />
                                                                {user.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            {user.is_active && user.last_login_at && (
                                                                <span className="text-muted-foreground">
                                                                    Logged in:{' '}
                                                                    {new Date(user.last_login_at).toLocaleString()}
                                                                </span>
                                                            )}
                                                            {!user.is_active && user.last_logout_at && (
                                                                <span className="text-muted-foreground">
                                                                    Logged out:{' '}
                                                                    {new Date(user.last_logout_at).toLocaleString()}
                                                                    {user.minutes_since_logout !== null && (
                                                                        <span className="ml-1">
                                                                            ({user.minutes_since_logout} min ago)
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            )}
                                                            {user.last_ip_address && (
                                                                <span className="text-muted-foreground text-[10px]">
                                                                    IP: {user.last_ip_address}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">{getStatusBadge(user.approval_status)}</td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-end gap-2">
                                                            {user.approval_status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleApprove(user.id)}
                                                                        disabled={processing === user.id}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        <CheckCircle2 className="size-4" />
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleReject(user.id)}
                                                                        disabled={processing === user.id}
                                                                    >
                                                                        <XCircle className="size-4" />
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {user.approval_status === 'approved' && (
                                                                <span className="text-sm text-muted-foreground">Approved</span>
                                                            )}
                                                            {user.approval_status === 'rejected' && (
                                                                <span className="text-sm text-muted-foreground">Rejected</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

