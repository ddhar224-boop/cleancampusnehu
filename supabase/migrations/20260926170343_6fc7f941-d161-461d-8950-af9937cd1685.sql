REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_profile_verification() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.subscription_price() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_order_status() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;