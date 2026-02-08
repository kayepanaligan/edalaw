import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type Notification = {
    id: number;
    type: string;
    title: string;
    message: string;
    created_at: string;
};

type PageProps = {
    recentNotifications?: Notification[];
    unreadNotificationCount?: number;
};

export function useNotifications(): void {
    const page = usePage();
    const props = page.props as PageProps;
    const seenNotificationIds = useRef<Set<number>>(new Set());
    const lastCheckTime = useRef<number>(Date.now());
    const isInitialized = useRef<boolean>(false);

    // Initialize seen notification IDs from current notifications on mount
    useEffect(() => {
        if (props.recentNotifications && !isInitialized.current) {
            props.recentNotifications.forEach((notification) => {
                seenNotificationIds.current.add(notification.id);
            });
            isInitialized.current = true;
            lastCheckTime.current = Date.now();
        }
    }, []);

    // Check for new notifications when props change (e.g., after navigation or polling)
    useEffect(() => {
        if (props.recentNotifications && isInitialized.current) {
            props.recentNotifications.forEach((notification) => {
                const notificationTime = new Date(notification.created_at).getTime();
                if (
                    !seenNotificationIds.current.has(notification.id) &&
                    notificationTime > lastCheckTime.current
                ) {
                    seenNotificationIds.current.add(notification.id);
                    
                    // Show toast notification
                    toast.info(notification.title, {
                        description: notification.message,
                        duration: 5000,
                    });
                }
            });
            lastCheckTime.current = Date.now();
        }
    }, [props.recentNotifications]);

    // Poll for new notifications every 15 seconds
    useEffect(() => {
        if (!isInitialized.current) {
            return;
        }

        const interval = setInterval(() => {
            // Lightweight polling - only reload notification data
            router.reload({
                only: ['recentNotifications', 'unreadNotificationCount'],
                preserveScroll: true,
                preserveState: true,
            });
        }, 15000); // Poll every 15 seconds

        return () => {
            clearInterval(interval);
        };
    }, []);
}

