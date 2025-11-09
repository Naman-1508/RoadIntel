import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import API from "@/utility/api";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
  requireRole?: "user" | "admin";
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireRole,
}: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded, getToken, signOut } = useAuth();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Wait for Clerk to finish loading the token
        const token = await getToken();

        if (!token) {
          console.warn("⚠️ Clerk token not available yet, retrying...");
          setTimeout(syncUser, 1000);
          return;
        }

        // Sync user with backend
        const res = await API.post(
          "/auth/sync",
          { clerkId: user.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.user) {
          setUserRole(res.data.user.role);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          console.warn("⚠️ Backend returned no user object.");
        }
      } catch (err: any) {
        console.error("❌ Failed to sync user:", err.response?.data || err.message);

        // Handle expired/invalid Clerk token
        if (err.response?.status === 401) {
          console.warn("⚠️ Clerk token expired — signing out...");
          await signOut();
        }
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/" replace />;
  if (requireAdmin && userRole !== "admin") return <Navigate to="/user/dashboard" replace />;
  if (requireRole && userRole !== requireRole) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
