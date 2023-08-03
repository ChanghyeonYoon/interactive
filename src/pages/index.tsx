import Link from "next/link";
import Button from "@/components/button";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Button>
        <Link href={"/box"}>Three.js Box</Link>
      </Button>
    </main>
  );
}
