import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { BRAND } from "@/lib/campusclean";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | CampusClean" },
      { name: "description", content: "What personal data CampusClean collects, why, how long we keep it and your rights." },
      { property: "og:title", content: "CampusClean Privacy Policy" },
      { property: "og:description", content: "What we collect, why, and your rights over your data." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="26 September 2026">
      <section>
        <p>
          This policy explains how CampusClean ("we", "us") handles personal data when you use our website and laundry service. We process data in line with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
        </p>
      </section>
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Account details: name, email address, mobile number and password (stored only as a secure hash).</li>
          <li>Campus details: student or staff status, Student or Staff ID, campus, hostel and room.</li>
          <li>Order details: services chosen, weights, pickup address and slot, instructions, payments and order history.</li>
          <li>Technical data: basic logs such as IP address and browser type, used to keep the service secure.</li>
        </ul>
      </section>
      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To create your account and confirm you belong to a campus we serve.</li>
          <li>To collect, clean and return your laundry, and to contact you about your order.</li>
          <li>To record payments, handle complaints and claims, and keep accounting records required by law.</li>
          <li>To protect the service against fraud and misuse.</li>
        </ul>
        <p>We do not sell your data and we do not use it for third-party advertising.</p>
      </section>
      <section>
        <h2>Who can see it</h2>
        <p>
          Only CampusClean staff who need it to fulfil your order, and service providers that host our website and database under contract. We share data with authorities only when the law requires it.
        </p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        <p>
          Account data is kept while your account is open. Order and payment records are kept for up to 8 years to meet tax and accounting rules. When you delete your account, other data is erased within 30 days.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          You can view and correct your details on your profile page at any time. You can also ask us for a copy of your data, ask us to erase it, or withdraw consent, by emailing {BRAND.email}. We respond within 30 days.
        </p>
      </section>
      <section>
        <h2>Security</h2>
        <p>
          Data is sent over encrypted connections and access is limited by account, so customers can only see their own orders. No system is perfectly secure; if a breach affects you, we will tell you and the Data Protection Board as required.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions or complaints about privacy: {BRAND.email}.</p>
      </section>
    </LegalPage>
  );
}
