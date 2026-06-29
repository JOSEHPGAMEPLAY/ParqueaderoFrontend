'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    CalendarDaysIcon,
    UserCircleIcon,
    UsersIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@heroui/button';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const navItems = [
        { href: '/dashboard', label: 'Registros diarios', icon: CalendarDaysIcon, roles: ['user', 'admin', 'owner'] },
        { href: '/dashboard/perfil', label: 'Perfil', icon: UserCircleIcon, roles: ['user', 'admin', 'owner'] },
    ];

    if (user?.role === 'admin' || user?.role === 'owner') {
        navItems.push({ href: '/dashboard/usuarios', label: 'Usuarios', icon: UsersIcon, roles: ['admin', 'owner'] });
    }

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 p-4 border-b border-default-200">
                <UserCircleIcon className="size-10 text-primary" />
                <div className="flex flex-col">
                    <p className="font-semibold text-sm">{user?.username}</p>
                    <p className="text-xs text-default-400 capitalize">{user?.role}</p>
                </div>
            </div>

            <nav className="flex-1 p-2 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            isActive(item.href)
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-default-600 hover:bg-default-100'
                        }`}
                    >
                        <item.icon className="size-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-2 border-t border-default-200">
                <Button
                    className="w-full justify-start"
                    color="danger"
                    variant="light"
                    startContent={<ArrowRightOnRectangleIcon className="size-5" />}
                    onPress={handleLogout}
                >
                    Cerrar sesión
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <button
                className="fixed top-4 left-4 z-50 lg:hidden bg-background border border-default-200 rounded-lg p-2 shadow-md"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <XMarkIcon className="size-6" /> : <Bars3Icon className="size-6" />}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 h-full w-64 bg-background border-r border-default-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent}
            </aside>
        </>
    );
};
