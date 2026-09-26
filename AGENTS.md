<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Order pricing is computed only in the `place_order` database function from the services table; clients never send prices. Why: prevents tampering.
- Roles live in `user_roles` checked via `has_role`; staff/admin UI at /admin relies on RLS, not client checks. Why: no privilege escalation.
- Public catalog/tracking reads use the browser client with narrow anon policies / `track_order` RPC (status only). Why: no personal data exposed.
