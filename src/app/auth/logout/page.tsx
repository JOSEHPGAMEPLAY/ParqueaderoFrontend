'use client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@heroui/button";


export default function Home() {
    const { logout } = useAuth();
    
    return (
        <div className="flex h-screen justify-center items-center">
            <Button color="danger" onClick={logout}>
                Cerrar sesión
            </Button>
        </div>
    );
}