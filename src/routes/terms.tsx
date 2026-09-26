import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { BRAND } from "@/lib/campusclean";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | CampusClean" },
      { name: "description", content: "The terms for using CampusClean laundry pickup, cleaning, delivery and plans." },
      { property: "og:title", content: "CampusClean Terms and Conditions" },
      { property: "og:description", content: "The terms for orders, payments, plans, claims and cancellations." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms and Conditions" updated="26 September 2026">
      <section>
        <p>By creating an account or placing an order with CampusClean you agree to these terms. If you do not agree, please do not use the service.</p>
      </section>
      <section>
        <h2>1. Accounts</h2>
        <ul>
          <li>You must give accurate details, including a valid mobile number and Student or Staff ID.</li>
          <li>We may verify your ID and may refuse or suspend accounts with false details.</li>
          <li>You are responsible for keeping your password private.</li>
        </ul>
      </section>
      <section>
        <h2>2. Orders and pricing</h2>
        <ul>
          <li>Prices are shown on the Services page and on your order summary before you confirm.</li>
          <li>Weight-based orders are weighed at pickup. If the weight differs from your estimate, the bill is updated to the actual weight.</li>
          <li>Turnaround times are targets, not guarantees. Delays caused by weather, power cuts or campus closures may occur.</li>
        </ul>
      </section>
      <section>
        <h2>3. Payment</h2>
        <p>Orders are paid in cash or UPI on delivery. We may hold clothes until an overdue bill is paid. Online card payments are not currently offered.</p>
      </section>
      <section>
        <h2>4. Plans</h2>
        <ul>
          <li>A plan starts on the day we receive payment and ends after the stated number of days.</li>
          <li>Unused kg or pickups do not carry over and are not refundable once the plan is active.</li>
          <li>A requested plan can be cancelled free of charge before it is paid.</li>
        </ul>
      </section>
      <section>
        <h2>5. Cancellations</h2>
        <p>You can cancel an order from your account until it has been picked up. After pickup, orders cannot be cancelled.</p>
      </section>
      <section>
        <h2>6. Your items</h2>
        <ul>
          <li>Empty all pockets. We are not responsible for cash, cards, electronics or jewellery left in clothes.</li>
          <li>Tell us about stains, tears, loose buttons and delicate fabrics in the order notes before pickup.</li>
          <li>We follow care labels. We are not responsible for colour run or shrinkage in items without labels or with incorrect labels.</li>
        </ul>
      </section>
      <section>
        <h2>7. Damage and loss</h2>
        <p>
          Report any problem within 48 hours of delivery by emailing {BRAND.email} with your order ID and photos. If we confirm an item was lost or damaged in our care, we will compensate up to 10 times the cleaning charge for that item, capped at ₹2,000 per order, unless a higher value was declared and accepted at pickup.
        </p>
      </section>
      <section>
        <h2>8. Liability</h2>
        <p>Apart from section 7 and anything the law does not allow us to exclude, our total liability for any order is limited to the amount paid for that order.</p>
      </section>
      <section>
        <h2>9. Changes and governing law</h2>
        <p>
          We may update these terms and will show the new date at the top of this page. These terms are governed by the laws of India, and courts in Meghalaya have jurisdiction.
        </p>
      </section>
      <section>
        <h2>10. Contact</h2>
        <p>{BRAND.email}</p>
      </section>
    </LegalPage>
  );
}
