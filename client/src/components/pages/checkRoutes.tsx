import { Button } from "@/components/ui/button";
import { useState } from "react";

const Settings = () => {
  const [data, setData] = useState("");

  const handleCheck = async () => {
    const res = await fetch("http://localhost:3000/api/me", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setData(JSON.stringify(data, null, 2));
  };

  return (
    <div className="h-full min-h-screen flex flex-col gap-6 items-center justify-center">
      <Button
        variant={"secondary"}
        size={"xl"}
        onClick={async () => {
          await handleCheck();
        }}
      >
        Check Route
      </Button>
      <pre>{data}</pre>
    </div>
  );
};

export default Settings;
