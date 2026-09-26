import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — CampusClean" },
      {
        name: "description",
        content:
          "Create your CampusClean account with your mobile number and Student or Staff ID to book campus laundry pickups.",
      },
      { property: "og:title", content: "Login or Register — CampusClean" },
      {
        property: "og:description",
        content: "Accounts for students and university staff, verified by campus ID.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <Section>
      <div className="mx-auto max-w-xl">
        <SectionHeading
          eyebrow="Accounts"
          title="Sign in to CampusClean"
          body="Accounts use your mobile number and your Student or Staff ID — no university email needed."
        />
        <Alert className="mt-8">
          <AlertTitle>Sign-up opens next</AlertTitle>
          <AlertDescription>
            Real accounts, mobile verification and campus ID approval are the next thing being
            built. Nothing here pretends to log you in.
          </AlertDescription>
        </Alert>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services">Browse services</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
