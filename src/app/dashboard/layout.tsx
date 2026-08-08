import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                {children}
            </main>
        </div>
    );
}
