'use client';
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="h-screen">
            <div className="flex h-full justify-center items-center">
                {children}
            </div>
        </section>
    );
}
