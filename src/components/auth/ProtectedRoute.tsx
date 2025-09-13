"useClient";
import { useAuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) return null;
    return <>{children}</>;
}