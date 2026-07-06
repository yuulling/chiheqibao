import { getSession } from "@/lib/auth";
import { jsonResponse } from "@/lib/utils";

export async function POST() {
  const session = await getSession();
  session.destroy();
  return jsonResponse({ success: true });
}
