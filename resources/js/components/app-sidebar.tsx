import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, BarChart3, Bell, Calendar, CalendarCheck, FileText, LayoutGrid, Link2, MessageSquare, Phone, Scale, Shield, Users, Heart, Monitor, Video, Camera, Flag, Settings, Sliders, Film, MessageCircle } from 'lucide-react';

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
                    {
                        title: 'Monitor Calls',
                        href: '/monitoring-officer/assigned-sessions',
                        icon: Video,
                    },
                    {
                        title: 'Video Recordings',
                        href: '/monitoring/video-recordings',
                        icon: Film,
                    },
                    {
                        title: 'Chat Recordings',
                        href: '/monitoring/chat-recordings',
                        icon: MessageCircle,
                    },
                    {
                        title: 'Incident Reporting',
                        href: '/admin/incident-reporting',
                        icon: Flag,
                    },
                    {
                        title: 'Inmate Tunnels',
                        href: '/admin/inmate-tunnels',
                        icon: Link2,
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
                        title: 'Apply for visit',
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

    // BJMP Officer navigation with categories
    let bjmpOfficerNavGroups: Array<{ label: string; items: NavItem[] }> | undefined;
    if (userRole === 'bjmp_officer') {
        const unreadBjmpCount = page.props.unreadNotificationCount ?? 0;
        bjmpOfficerNavGroups = [
            {
                label: 'Main',
                items: [
                    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
                    { title: 'Notifications', href: '/bjmp-officer/notifications', icon: Bell, badge: unreadBjmpCount > 0 ? unreadBjmpCount : undefined },
                ],
            },
            {
                label: 'Services',
                items: [
                    { title: 'E-Burol', href: '/bjmp-officer/eburols', icon: Heart },
                    { title: 'Visit Schedules', href: '/bjmp-officer/schedules', icon: Calendar },
                    { title: 'Appeals', href: '/bjmp-officer/appeals', icon: Scale },
                ],
            },
            {
                label: 'System',
                items: [
                    { title: 'History Logs', href: '/bjmp-officer/audit-logs', icon: FileText },
                    { title: 'Settings', href: '/settings', icon: Settings },
                ],
            },
        ];
    }

    // Monitoring Officer navigation with categories
    let monitoringOfficerNavGroups: Array<{ label: string; items: NavItem[] }> | undefined;
    if (userRole === 'monitoring_officer') {
        const unreadMoCount = page.props.unreadNotificationCount ?? 0;
        monitoringOfficerNavGroups = [
            {
                label: 'Main',
                items: [
                    {
                        title: 'Dashboard',
                        href: '/dashboard/monitoring-officer',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Assigned Sessions',
                        href: '/monitoring-officer/assigned-sessions',
                        icon: Video,
                    },
                    {
                        title: 'Notifications',
                        href: '/monitoring-officer/notifications',
                        icon: Bell,
                        badge: unreadMoCount > 0 ? unreadMoCount : undefined,
                    },
                ],
            },
            {
                label: 'Archives',
                items: [
                    {
                        title: 'History',
                        href: '/monitoring-officer/history',
                        icon: FileText,
                    },
                    {
                        title: 'Video Recordings',
                        href: '/monitoring-officer/video-recordings',
                        icon: Film,
                    },
                    {
                        title: 'Chat Recordings',
                        href: '/monitoring-officer/chat-recordings',
                        icon: MessageCircle,
                    },
                ],
            },
            {
                label: 'Security',
                items: [
                    {
                        title: 'Incident Reporting',
                        href: '/monitoring-officer/incidents',
                        icon: Flag,
                    },
                    {
                        title: 'Inmate Tunnel',
                        href: '/monitoring-officer/inmate-tunnels',
                        icon: Link2,
                    },
                ],
            },
            {
                label: 'Configuration',
                items: [
                    {
                        title: 'Settings',
                        href: '/settings',
                        icon: Settings,
                    },
                ],
            },
        ];
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
                ) : userRole === 'bjmp_officer' && bjmpOfficerNavGroups ? (
                    <NavMain groups={bjmpOfficerNavGroups} />
                ) : userRole === 'monitoring_officer' && monitoringOfficerNavGroups ? (
                    <NavMain groups={monitoringOfficerNavGroups} />
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
