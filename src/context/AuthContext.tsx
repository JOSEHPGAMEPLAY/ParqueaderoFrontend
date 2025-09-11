'use client';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, LoginInputs, User } from "@/types/auth";
import { getMe, loginFetch, logoutFetch } from "@/services/auth";
import { toast } from "react-toastify";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const logoutTimer = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await getMe();
                const payload = res.user;

                const mappedUser: User = {
                    id: payload.userId,
                    username: payload.username ?? "",
                    role: payload.role,
                };

                setUser(mappedUser);
                scheduleLogout(payload.exp);
            } catch {
                setUser(null);
                router.push('/auth/login');
            } finally{
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    const login = async (formData: LoginInputs): Promise<User> => {
        await loginFetch(formData);
        const res = await getMe();

        const payload = res.user;

        const mappedUser: User = {
            id: payload.userId,
            username: payload.username ?? "",
            role: payload.role,
        };

        setUser(mappedUser);
        scheduleLogout(payload.exp);

        return mappedUser;
    };

    const logout = async (showToast: boolean = false) => {
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        await logoutFetch();
        setUser(null);

        if (showToast) {
            toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        }

        router.push('/auth/login');
    }

    const scheduleLogout = (exp: number) => {
        const expiresInMs = exp * 1000 - Date.now();
        if (expiresInMs <= 0) {
            logout(true);
            return;
        }
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        
        logoutTimer.current = setTimeout(() => {    
            logout(true);
        }, expiresInMs);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within AuthProvider");
    return context;
};