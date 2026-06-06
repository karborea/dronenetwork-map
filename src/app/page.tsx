import { MapApp } from "@/components/map-app";
import { getPilots } from "@/lib/pilots";

export default async function HomePage() {
  const pilots = await getPilots();
  return <MapApp pilots={pilots} />;
}
