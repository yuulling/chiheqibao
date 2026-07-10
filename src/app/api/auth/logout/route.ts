import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/utils";

export async function POST() {
  const session = await getSession();
  if (session.userId) {
    await prisma.user
      .update({
        where: { id: session.userId },
        data: { sessionToken: null },
      })
      .catch(() => {});
  }
  session.destroy();
  return jsonResponse({ success: true });
}
