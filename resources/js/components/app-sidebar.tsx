import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import { dashboard as siswaDashboard, biodata as siswaBiodata, lagu as siswaLagu } from '@/routes/siswa';
import { dashboard as guruDashboard } from '@/routes/guru';
import { dashboard as orangtuaDashboard } from '@/routes/orangtua';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User, Music, Calendar, Users, GraduationCap, UserCog, ClipboardCheck } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: siswaDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Biodata',
        href: siswaBiodata(),
        icon: User,
    },
    {
        title: 'Lagu',
        href: siswaLagu(),
        icon: Music,
    },
    {
        title: 'Kegiatan Harian',
        href: siswaDashboard(),
        icon: Calendar,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/admin/dashboard',
        icon: LayoutGrid,
        items: [
            {
                title: 'Siswa',
                href: '/admin/siswa-dashboard',
            },
            {
                title: 'Guru',
                href: '/admin/guru-dashboard',
            },
            {
                title: 'Orang Tua',
                href: '/admin/orangtua-dashboard',
            },
        ],
    },
    {
        title: 'Kelola Pengguna',
        href: '/admin/users',
        icon: UserCog,
    },
];

const guruNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: guruDashboard(),
        icon: LayoutGrid,
    },
];

const orangtuaNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: orangtuaDashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    // Determine which nav items to show based on role
    let navItems = mainNavItems;
    let logoHref: string | ReturnType<typeof dashboard> = dashboard();

    if (userRole === 'siswa') {
        navItems = siswaNavItems;
        logoHref = siswaDashboard();
    } else if (userRole === 'admin') {
        navItems = adminNavItems;
        logoHref = '/admin/dashboard';
    } else if (userRole === 'guru') {
        navItems = guruNavItems;
        logoHref = guruDashboard();
    } else if (userRole === 'orangtua') {
        navItems = orangtuaNavItems;
        logoHref = orangtuaDashboard();
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[#344460] border-r-0">
            <SidebarHeader className="border-b border-white/20 pt-3 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/10 group-data-[collapsible=icon]:mt-1">
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-blue-400/30">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
