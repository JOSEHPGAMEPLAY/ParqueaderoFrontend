'use client';
import { logoutFetch } from "@/services/auth";
import { Button } from "@heroui/button";

export default function Home() {
    
    return (
        <div className="flex h-screen justify-center items-center">
            <Button color="danger" onClick={() => {logoutFetch()}}>
                Cerrar sesión
            </Button>
        </div>
    );
}