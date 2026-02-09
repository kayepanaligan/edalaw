import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Bell, Calendar, FileText, LayoutGrid, MessageSquare, Phone, Scale, Shield, Users, Heart, Monitor, Video, Camera, Flag, Settings, Sliders } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';


export function AppSidebar() {
    const page = usePage<SharedData>();
    
    if (!page?.props) {
        return null;
    }
    
    const auth = page.props.auth;
    const userRole = auth?.user?.role;

    const mainNavItems: NavItem[] = [];
    
    // Only add Dashboard to mainNavItems for non-visitor and non-super_admin roles
    // (super_admin uses groups, visitor uses groups)
    if (userRole !== 'visitor' && userRole !== 'super_admin') {
        mainNavItems.push({
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        });
    }

    // Super Admin navigation with categories
    let superAdminNavGroups: Array<{ label: string; items: NavItem[] }> | undefined;
    if (userRole === 'super_admin') {
        const unreadAdminCount = typeof page.props.unreadAdminNotificationCount === 'number' ? page.props.unreadAdminNotificationCount : 0;
        
        superAdminNavGroups = [
            {
                label: 'Main',
                items: [
                    {
                        title: 'Dashboard',
                        href: '/dashboard',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Notification',
                        href: '/admin/notifications',
                        icon: Bell,
                        badge: unreadAdminCount > 0 ? unreadAdminCount : undefined,
                    },
                ],
            },
            {
                label: 'Services',
                items: [
                    {
                        title: 'Visit',
                        href: '/admin/schedules',
                        icon: Calendar,
                    },
                    {
                        title: 'E-Burol',
                        href: '/admin/eburols',
                        icon: Heart,
                    },
                    {
                        title: 'Appeals',
                        href: '/admin/appeals',
                        icon: Scale,
                    },
                ],
            },
            {
                label: 'Monitoring',
                items: [
                    {
                        title: 'Users',
                        href: '/admin/users',
                        icon: Users,
                    },
                    {
                        title: 'Sessions',
                        href: '/admin/sessions',
                        icon: Monitor,
                    },
                ],
            },
            {
                label: 'Administration',
                items: [
                    {
                        title: 'Configuration',
                        href: '/settings/time-slot-capacity',
                        icon: Sliders,
                    },
                    {
                        title: 'System History',
                        href: '/admin/audit-logs',
                        icon: FileText,
                    },
                    {
                        title: 'Settings',
                        href: '/settings',
                        icon: Settings,
                    },
                    {
                        title: 'Feedback',
                        href: '/admin/suggestions',
                        icon: MessageSquare,
                    },
                ],
            },
        ];
    }

    // Visitor navigation with categories
    let visitorNavGroups: Array<{ label: string; items: NavItem[] }> | undefined;
    if (userRole === 'visitor') {
        const unreadCount = page.props.unreadNotificationCount || 0;
        
        visitorNavGroups = [
            {
                label: 'Main',
                items: [
                    {
                        title: 'Dashboard',
                        href: '/dashboard',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Notification',
                        href: '/visitor/notifications',
                        icon: Bell,
                        badge: unreadCount > 0 ? unreadCount : undefined,
                    },
                ],
            },
            {
                label: 'Applications',
                items: [
                    {
                        title: 'Apply for Visit',
                        href: '/visitor/schedule',
                        icon: Calendar,
                    },
                    {
                        title: 'Apply for E-Burol',
                        href: '/visitor/eburol',
                        icon: Heart,
                    },
                    {
                        title: 'Appeal',
                        href: '/visitor/appeals',
                        icon: Scale,
                    },
                ],
            },
            {
                label: 'Logs & Records',
                items: [
                    {
                        title: 'History',
                        href: '/visitor/history',
                        icon: FileText,
                    },
                    {
                        title: 'Call Logs',
                        href: '/visitor/call-logs',
                        icon: Phone,
                    },
                    {
                        title: 'Session',
                        href: '/visitor/sessions',
                        icon: Shield,
                    },
                ],
            },
            {
                label: 'Support',
                items: [
                    {
                        title: 'Feedback',
                        href: '/visitor/suggestions',
                        icon: MessageSquare,
                    },
                    {
                        title: 'Settings',
                        href: '/settings',
                        icon: Settings,
                    },
                ],
            },
        ];
    }

    // BJMP Officer navigation
    if (userRole === 'bjmp_officer') {
        mainNavItems.push({
            title: 'E-Burol Management',
            href: '/bjmp-officer/eburols',
            icon: Heart,
        });
        mainNavItems.push({
            title: 'Visit Schedules',
            href: '/bjmp-officer/schedules',
            icon: Calendar,
        });
        mainNavItems.push({
            title: 'Appeal Processing',
            href: '/bjmp-officer/appeals',
            icon: Scale,
        });
        mainNavItems.push({
            title: 'History Logs',
            href: '/bjmp-officer/audit-logs',
            icon: FileText,
        });
        mainNavItems.push({
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        });
    }

    // Monitoring Officer navigation
    if (userRole === 'monitoring_officer') {
        mainNavItems.push({
            title: 'Session Monitoring',
            href: '/monitoring-officer/sessions',
            icon: Monitor,
        });
        mainNavItems.push({
            title: 'Live Video Supervision',
            href: '/monitoring-officer/video-supervision',
            icon: Video,
        });
        mainNavItems.push({
            title: 'Recordings',
            href: '/monitoring-officer/recordings',
            icon: Camera,
        });
        mainNavItems.push({
            title: 'Chat Oversight',
            href: '/monitoring-officer/chat',
            icon: MessageSquare,
        });
        mainNavItems.push({
            title: 'Incident Reporting',
            href: '/monitoring-officer/incidents',
            icon: Flag,
        });
        mainNavItems.push({
            title: 'Session Control',
            href: '/monitoring-officer/sessions',
            icon: Shield,
        });
        mainNavItems.push({
            title: 'Monitoring Logs',
            href: '/monitoring-officer/logs',
            icon: FileText,
        });
        mainNavItems.push({
            title: 'Alerts',
            href: '/monitoring-officer/alerts',
            icon: AlertTriangle,
        });
        mainNavItems.push({
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        });
    }


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {userRole === 'visitor' && visitorNavGroups ? (
                    <NavMain groups={visitorNavGroups} />
                ) : userRole === 'super_admin' && superAdminNavGroups ? (
                    <NavMain groups={superAdminNavGroups} />
                ) : (
                    <NavMain items={mainNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
              
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
