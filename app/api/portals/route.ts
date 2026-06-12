import { NextRequest, NextResponse } from "next/server";
import { createPortal, getPortalByAccessKey, getPortals } from "@/lib/portalRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const accessKey = request.nextUrl.searchParams.get("accessKey");
    if (accessKey) {
      const portal = await getPortalByAccessKey(accessKey);
      if (!portal) return NextResponse.json({ error: "Portal not found" }, { status: 404 });
      if (portal.status === "inactive") return NextResponse.json({ error: "Portal inactive", portal }, { status: 403 });
      return NextResponse.json({ portal });
    }

    const portals = await getPortals({ includeMocks: true, includeOutputs: true });
    return NextResponse.json({ portals });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const portal = await createPortal(input);
    return NextResponse.json({ portal }, { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}

function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status });
}
