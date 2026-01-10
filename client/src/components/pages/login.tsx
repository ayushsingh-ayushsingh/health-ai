import { LogoIcon } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { authClient, REDIRECT_URL } from "@/lib/auth-client";
import { useState, useEffect, type FormEvent } from "react";
import { toastManager } from "../ui/toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "../ai-elements/loader";
import { GithubIcon } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const session = authClient.useSession();

  useEffect(() => {
    if (session.data) {
      toastManager.add({
        type: "success",
        title: "Already logged in",
        description: "Redirecting to dashboard...",
      });
      navigate("/dashboard");
    }
  }, [session, navigate]);

  if (session.isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          toastManager.add({
            type: "success",
            title: "Success",
            description: "Logged in successfully",
          });
          navigate("/dashboard");
        },
        onError: () => {
          toastManager.add({
            type: "error",
            title: "Error",
            description: "Error logging in",
          });
        },
      },
    );
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action=""
        onSubmit={handleSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <Link to="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Login to Health AI
            </h1>
            <p className="text-sm">Welcome back! Login to continue</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: REDIRECT_URL,
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "github",
                  callbackURL: REDIRECT_URL,
                });
              }}
            >
              <span className="bg-white rounded-full size-4 items-center justify-center flex">
                <GithubIcon className="text-black mt-1 fill-black size-3.5 opacity-100" />
              </span>
              <span>Github</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                name="email"
                id="email"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
                <Button
                  render={
                    <Link
                      to="#"
                      className="link intent-info variant-ghost text-sm"
                    >
                      Forgot your Password ?
                    </Link>
                  }
                  variant="link"
                  size="sm"
                ></Button>
              </div>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                className="input sz-md variant-mixed"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button className="w-full" type="submit">
              Login In
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-lg border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account ?
            <Button
              render={<Link to="/signup">Create account</Link>}
              variant="link"
              className="px-2"
            ></Button>
          </p>
        </div>
      </form>
    </section>
  );
}
