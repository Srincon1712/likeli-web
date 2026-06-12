import { PortalRoute } from "@/components/PortalApp";

export default async function PortalPage({ params }: { params: Promise<{ clientSlug: string; accessKey: string }> }) {
  const { clientSlug, accessKey } = await params;
  return <PortalRoute clientSlug={clientSlug} accessKey={accessKey} />;
}
