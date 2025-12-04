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
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User, Music, Calendar, Users, GraduationCap, UserCog } from 'lucide-react';
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

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    // Determine which nav items to show based on role
    let navItems = mainNavItems;
    if (userRole === 'siswa') {
        navItems = siswaNavItems;
    } else if (userRole === 'admin') {
        navItems = adminNavItems;
    }
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-gradient-to-b from-blue-600 to-blue-500 border-r-0">
            <SidebarHeader className="border-b border-blue-400/30">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-blue-500/30">
                            <Link href={dashboard()} prefetch>
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
