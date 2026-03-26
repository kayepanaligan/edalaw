import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Key, Video, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

type Props = {
    session: {
        id: number;
        meeting_id: string;
        room_id: string;
        session_id?: string;
        visit_type: 'visit' | 'eburol';
        status: string;
        session_started_at: string;
        session_ended_at: string;
        duration: string;
        duration_seconds: number;
        unique_participants_count: number;
        visitor_name: string;
        visitor_email?: string | null;
        inmate_name: string;
        jail_officer_name?: string | null;
        jail_officer_email?: string | null;
        notes?: string | null;
        participants: any[];
        analytics: any;
        chat_stats: {
            total_messages: number;
            flagged_messages: number;
            first_message_at?: string;
            last_message_at?: string;
        };
        timeline: any[];
        has_chat_logs: boolean;
        has_recording: boolean;
        visit?: {
            id: number;
            visit_type: 'virtual' | 'physical';
            status: string;
            access_key?: string | null;
            access_key_expires_at?: string | null;
            rejection_reason?: string | null;
            relationship_proof_path?: string | null;
            additional_proof_path?: string | null;
            meeting_link?: string | null;
            daily_co_room_id?: string | null;
            inmate_token?: string | null;
            notes?: string | null;
            jail_officer_name?: string | null;
        } | null;
    };
};

export default function VisitMonitoredSessionDetails({ session }: Props) {
    useToast();

    const handleDownloadChat = async () => {
        try {
            const response = await fetch(`/video/chat/export/${session.session_id || session.meeting_id}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chat_log_${session.meeting_id}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Chat downloaded successfully');
            } else {
                toast.error('Failed to download chat');
            }
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Error downloading chat');
        }
    };

    const visit = session.visit;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Visit Monitored Management', href: '/jail-officer/visits-monitored' },
            { title: `Session ${session.meeting_id}`, href: `/jail-officer/visits-monitored/${session.meeting_id}` }
        ]}>
            <Head title={`Session Details - ${session.meeting_id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Session Details</h1>
                        {session.has_chat_logs && (
                            <Button onClick={handleDownloadChat}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Chat
                            </Button>
                        )}
                    </div>
                
                    {/* Meeting Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Meeting Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Meeting ID</p>
                                <p className="font-medium">{session.meeting_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge>{session.status || 'completed'}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">{session.duration || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Participants</p>
                                <p className="font-medium">{session.unique_participants_count || 2}</p>
                            </div>
                        </CardContent>
                    </Card>
                
                    {/* Visit Details - Only show if this is a visit session */}
                    {visit && (
                        <>
                            {/* Supporting Documents */}
                            {(visit.relationship_proof_path || visit.additional_proof_path) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Supporting Documents
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {visit.relationship_proof_path && (
                                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">Proof of Relationship</p>
                                                        <p className="text-xs text-muted-foreground">Uploaded during application</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/documents/visit/${visit.relationship_proof_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2"
                                                    >
                                                        <Download className="h-3 w-3" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                                            
                                        {visit.additional_proof_path && (
                                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">Additional Supporting Document</p>
                                                        <p className="text-xs text-muted-foreground">Uploaded during application</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/documents/visit/${visit.additional_proof_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2"
                                                    >
                                                        <Download className="h-3 w-3" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                
                            {/* Rejection Reason - Show only if rejected */}
                            {visit.status === 'rejected' && visit.rejection_reason && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-destructive">
                                            <AlertCircle className="h-5 w-5" />
                                            Rejection Reason
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 border rounded-lg bg-destructive/10">
                                            <p className="text-sm text-destructive font-medium">Reason for rejection:</p>
                                            <p className="mt-2 text-sm">{visit.rejection_reason}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                
                            {/* Physical Visit Details - Access Key */}
                            {visit.visit_type === 'physical' && visit.access_key && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Key className="h-5 w-5" />
                                            Access Key
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 border rounded-lg bg-muted">
                                            <p className="text-sm text-muted-foreground mb-2">Appointment Access Key:</p>
                                            <code className="text-2xl font-mono font-bold tracking-wider">
                                                {visit.access_key}
                                            </code>
                                            {visit.access_key_expires_at && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Expires: {new Date(visit.access_key_expires_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                
                            {/* Virtual Visit Details - Inmate Token & Meeting Room */}
                            {visit.visit_type === 'virtual' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Video className="h-5 w-5" />
                                            Virtual Visit Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {visit.inmate_token && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Inmate Tunnel Token:</p>
                                                <code className="block p-3 bg-muted rounded-lg text-sm font-mono break-all">
                                                    {visit.inmate_token}
                                                </code>
                                            </div>
                                        )}
                                        {visit.daily_co_room_id && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Meeting Room ID:</p>
                                                <code className="block p-3 bg-muted rounded-lg text-sm font-mono">
                                                    {visit.daily_co_room_id}
                                                </code>
                                            </div>
                                        )}
                                        {visit.meeting_link && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Meeting Link:</p>
                                                <a
                                                    href={visit.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                                                >
                                                    <Video className="h-4 w-4" />
                                                    Open Meeting Room
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                        {/* Participant Timeline */}
                        {session.timeline && session.timeline.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Participant Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {session.timeline.map((event: any, index: number) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="text-sm font-medium">{event.participant_name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {event.role}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {event.event.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Chat Statistics */}
                        {session.chat_stats && session.chat_stats.total_messages > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Chat Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Messages</p>
                                        <p className="text-2xl font-bold">{session.chat_stats.total_messages}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Flagged Messages</p>
                                        <p className="text-2xl font-bold text-destructive">{session.chat_stats.flagged_messages || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Message</p>
                                        <p className="text-sm">
                                            {session.chat_stats.last_message_at
                                                ? new Date(session.chat_stats.last_message_at).toLocaleString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </div>
        </AppLayout>
    );
}
