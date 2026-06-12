import { NextRequest, NextResponse } from "next/server";
import { deletePortal, getPortalByRoute, getPortalBySlug, setPortalStatus, updatePortal } from "@/lib/portalRepository";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const accessKey = request.nextUrl.searchParams.get("accessKey");
    const portal = accessKey ? await getPortalByRoute(slug, accessKey) : await getPortalBySlug(slug);
    if (!portal) return NextResponse.json({ error: "Portal not found" }, { status: 404 });

    return NextResponse.json({ portal });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const input = await request.json();
    const portal = input.status ? await setPortalStatus(slug, input.status) : await updatePortal(slug, input);
    if (!portal) return NextResponse.json({ error: "Portal not found" }, { status: 404 });

    return NextResponse.json({ portal });
  } catch (error) {
    return jsonError(error, 400);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const deleted = await deletePortal(slug);
    if (!deleted) return NextResponse.json({ error: "Portal not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}

function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status });
}
