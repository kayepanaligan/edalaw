import { Link, usePage } from '@inertiajs/react';
import { Bell, Calendar, LayoutGrid, MessageSquare, Phone, Scale, Shield, Users, Heart, Monitor } from 'lucide-react';

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
    }

    // Super Admin navigation
    if (userRole === 'super_admin') {
        const unreadAdminCount = page.props.unreadAdminNotificationCount || 0;
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
