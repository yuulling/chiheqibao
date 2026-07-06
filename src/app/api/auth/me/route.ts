import { getCurrentUser } from "@/lib/auth";
import { jsonResponse } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return jsonResponse({ user: null });
  }
  return jsonResponse({ user });
}
