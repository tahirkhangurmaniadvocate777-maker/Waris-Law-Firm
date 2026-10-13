import { redirect } from "next/navigation";
import { FBR_SECP_HUB_PATH } from "@/lib/config/taxGuides";

/** Alias URL — canonical hub lives at /tools/fbr-secp-practice. */
export default function FbrSecpHubAliasPage() {
  redirect(FBR_SECP_HUB_PATH);
}
