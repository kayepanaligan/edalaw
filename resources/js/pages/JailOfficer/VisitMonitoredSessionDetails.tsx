import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

type Props = {
    session: any;
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
                        <Button onClick={handleDownloadChat}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Chat
                        </Button>
                    </div>

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

                    <Card>
                        <CardHeader>
                            <CardTitle>Note</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Detailed session analytics and chat logs are being prepared. Please check back later for complete metrics.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
