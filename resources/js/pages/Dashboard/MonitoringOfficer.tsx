import { Head } from '@inertiajs/react';
import { AlertTriangle, Camera, Clock, FileText, Monitor, Video } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Monitoring Officer',
    },
];

type Props = {
    stats: {
        active_sessions: number;
        today_sessions: number;
        unread_alerts: number;
        pending_incidents: number;
    };
};

export default function MonitoringOfficerDashboard({ stats }: Props) {
    useToast();
    useNotifications();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoring Officer Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Monitoring Officer Dashboard</h1>
                        <p className="text-muted-foreground">
                            Monitor and supervise virtual visitations and e-burol sessions
                        </p>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_sessions}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently being monitored
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today_sessions}</div>
                            <p className="text-xs text-muted-foreground">
                                Sessions monitored today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unread_alerts}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Incidents</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_incidents}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting review
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common monitoring tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Use the sidebar to access:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Session Monitoring - View active sessions</li>
                                <li>Live Video Supervision - Join and monitor sessions</li>
                                <li>Recordings - Access session recordings</li>
                                <li>Chat Oversight - Monitor live chat</li>
                                <li>Incident Reporting - Report violations</li>
                                <li>Session Control - Manage active sessions</li>
                                <li>Monitoring Logs - View audit trail</li>
                                <li>Alerts - View system alerts</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                            <CardDescription>Monitoring system health</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Recording System</span>
                                    <span className="text-sm font-medium text-green-600">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Chat Monitoring</span>
                                    <span className="text-sm font-medium text-green-600">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Alert System</span>
                                    <span className="text-sm font-medium text-green-600">Active</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

