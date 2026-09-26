import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log in or create an account | CampusClean" },
      { name: "description", content: "Sign in to CampusClean to book laundry pickups, track orders and manage your plan." },
      { property: "og:title", content: "Log in to CampusClean" },
      { property: "og:description", content: "Book pickups, track orders and manage your laundry plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10 digit Indian mobile number"),
  member_type: z.enum(["student", "staff"]),
  institution_id: z.string().trim().min(3, "Enter your Student or Staff ID").max(40),
  hostel: z.string().trim().max(80),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" && s) navigate({ to: "/dashboard", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")).trim(),
      password: String(f.get("password")),
    });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  async function onSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = signUpSchema.safeParse(f);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const { email, password, ...meta } = parsed.data;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/dashboard", data: { ...meta, campus: "Tura Campus" } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data.session) setSent(email);
  }

  async function onForgot(email: string) {
    if (!z.string().email().safeParse(email).success) return toast.error("Enter your email above first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent. Check your inbox.");
  }

  async function onGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="container-page grid max-w-md gap-6 py-14">
      <div>
        <h1 className="text-3xl font-bold">Your CampusClean account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Book pickups, follow every order and manage your plan.
        </p>
      </div>

      {sent ? (
        <Alert>
          <AlertDescription>
            We sent a confirmation link to <strong>{sent}</strong>. Open it to activate your account, then log in.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Log in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={onSignIn} className="mt-4 grid gap-4">
                <Field label="Email" name="email" type="email" autoComplete="email" required />
                <Field label="Password" name="password" type="password" autoComplete="current-password" required />
                <Button type="submit" disabled={busy}>{busy ? "Signing in..." : "Log in"}</Button>
                <button
                  type="button"
                  className="text-left text-sm text-primary hover:underline"
                  onClick={(e) => {
                    const input = e.currentTarget.form?.elements.namedItem("email") as HTMLInputElement | null;
                    onForgot(input?.value.trim() ?? "");
                  }}
                >
                  Forgot password?
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={onSignUp} className="mt-4 grid gap-4">
                <Field label="Full name" name="full_name" autoComplete="name" required />
                <Field label="Email" name="email" type="email" autoComplete="email" required />
                <Field label="Mobile number" name="mobile" inputMode="numeric" placeholder="10 digits" required />
                <div className="grid gap-2">
                  <Label htmlFor="member_type">I am</Label>
                  <select id="member_type" name="member_type" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="student">A student</option>
                    <option value="staff">Staff or faculty</option>
                  </select>
                </div>
                <Field label="Student or Staff ID" name="institution_id" required />
                <Field label="Hostel or residence (optional)" name="hostel" />
                <Field label="Password" name="password" type="password" autoComplete="new-password" required />
                <p className="text-xs text-muted-foreground">
                  Your ID is checked by our team before your first pickup. By creating an account you agree to our{" "}
                  <Link to="/terms" className="underline">Terms</Link> and{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>.
                </p>
                <Button type="submit" disabled={busy}>{busy ? "Creating account..." : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={onGoogle}>Continue with Google</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...rest} />
    </div>
  );
}
