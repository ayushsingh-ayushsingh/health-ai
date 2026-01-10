import { Button } from "@/components/ui/button";
import { authClient, logOut } from "@/lib/auth-client";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../ui/toast";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-screen text-7xl flex flex-col gap-6 items-center justify-center">
      Dashboard
      <div className="flex gap-6">
        <Button
          variant={"secondary"}
          size={"xl"}
          onClick={async () => {
            await logOut();
            navigate("/");
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

export default Settings;
