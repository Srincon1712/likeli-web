import { NextRequest, NextResponse } from "next/server";
import { getPortalOutput, savePortalOutput } from "@/lib/portalRepository";
import type { PortalPlanId } from "@/types/likeliPortalOutput";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const output = await getPortalOutput(slug);
    if (!output) return NextResponse.json({ error: "Output not found" }, { status: 404 });
    return NextResponse.json({ output });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    if (!body?.output || typeof body.output !== "object") {
      return NextResponse.json({ error: "output is required" }, { status: 400 });
    }

    const output = await savePortalOutput(slug, body.output, body.portalPlanId as PortalPlanId);
    if (!output) return NextResponse.json({ error: "Portal not found" }, { status: 404 });

    return NextResponse.json({ output });
  } catch (error) {
    return jsonError(error, 400);
  }
}

function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status });
}
