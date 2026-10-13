import { redirect } from "next/navigation";

/** Legacy path — login UI lives on /admin when unauthenticated. */
export default function AdminLoginRedirectPage() {
  redirect("/admin");
}
