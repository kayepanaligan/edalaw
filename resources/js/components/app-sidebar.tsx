import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Bell, Calendar, FileText, LayoutGrid, MessageSquare, Phone, Scale, Shield, Users, Heart, Monitor, Video, Camera, Flag } from 'lucide-react';

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

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Add User Management and Schedule Management for super admin
    if (userRole === 'super_admin') {
        mainNavItems.push({
            title: 'Users',
            href: '/admin/users',
            icon: Users,
        });
        mainNavItems.push({
            title: 'Schedules',
            href: '/admin/schedules',
            icon: Calendar,
        });
        mainNavItems.push({
            title: 'Appeals',
            href: '/admin/appeals',
            icon: Scale,
        });
        mainNavItems.push({
            title: 'Sessions',
            href: '/admin/sessions',
            icon: Monitor,
        });
    }

    // Add Schedule Management, Call Logs, E-Burol, and Notifications for visitors
    if (userRole === 'visitor') {
        mainNavItems.push({
            title: 'Apply for Visit',
            href: '/visitor/schedule',
            icon: Calendar,
        });
        
        mainNavItems.push({
            title: 'Apply for E-Burol',
            href: '/visitor/eburol',
            icon: Heart,
        });
        
        const unreadCount = page.props.unreadNotificationCount || 0;
        mainNavItems.push({
            title: 'Notifications',
            href: '/visitor/notifications',
            icon: Bell,
            badge: unreadCount > 0 ? unreadCount : undefined,
        });
        mainNavItems.push({
            title: 'Session Tracking',
            href: '/visitor/sessions',
            icon: Shield,
        });
        mainNavItems.push({
            title: 'Call Logs',
            href: '/visitor/call-logs',
            icon: Phone,
        });
        mainNavItems.push({
            title: 'Appeal',
            href: '/visitor/appeals',
            icon: Scale,
        });
        mainNavItems.push({
            title: 'Feedback',
            href: '/visitor/suggestions',
            icon: MessageSquare,
        });
        mainNavItems.push({
            title: 'History',
            href: '/visitor/history',
            icon: FileText,
        });
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
    }

    // Super Admin navigation
    if (userRole === 'super_admin') {
        const unreadAdminCount = typeof page.props.unreadAdminNotificationCount === 'number' ? page.props.unreadAdminNotificationCount : 0;
        mainNavItems.push({
            title: 'Notifications',
            href: '/admin/notifications',
            icon: Bell,
            badge: unreadAdminCount > 0 ? unreadAdminCount : undefined,
        });
        mainNavItems.push({
            title: 'Feedback',
            href: '/admin/suggestions',
            icon: MessageSquare,
        });
        mainNavItems.push({
            title: 'System History',
            href: '/admin/audit-logs',
            icon: FileText,
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
              
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
