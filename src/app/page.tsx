import dynamic from "next/dynamic";

const Begleiter = dynamic(() => import("@/components/Begleiter"), { ssr: false });

export default function Home() {
  return <Begleiter />;
}
