import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toastManager } from "../ui/toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();

  useEffect(() => {
    if (session.isPending) return;
    if (!session.data) {
      toastManager.add({
        type: "error",
        title: "Unauthenticated",
        description: "Redirecting to Homepage...",
      });
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="h-full min-h-screen text-7xl flex flex-col gap-6 items-center justify-center">
      Dashboard
      <div className="flex gap-6">
        <Button
          variant={"secondary"}
          size={"xl"}
          onClick={async () => {
            const logout = await authClient.signOut();
            if (logout.data?.success) {
              toastManager.add({
                type: "info",
                title: "Logged out successfully",
                description: "Redirecting to Homepage",
              });
              navigate("/");
            } else {
              toastManager.add({
                type: "error",
                title: "Error occurred",
                description: logout.error?.message || "Try again",
              });
            }
          }}
        >
          Logout
        </Button>
        <Button
          variant={"secondary"}
          size={"xl"}
          render={<Link to={"/"}>Home</Link>}
        ></Button>
        <Button
          variant={"secondary"}
          size={"xl"}
          render={<Link to="/login">Login</Link>}
        ></Button>
        <Button
          variant={"secondary"}
          size={"xl"}
          render={<Link to="/signup">Signup</Link>}
        ></Button>
      </div>
    </div>
  );
};

export default Dashboard;
