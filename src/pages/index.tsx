import Link from "next/link";
import Button from "@/components/button";

const LIST = [
  {
    name: "Three.js Box",
    path: "/box",
  },
  {
    name: "Three.js Object3D",
    path: "/object3D",
  },
  {
    name: "Three.js Object3D Transforms",
    path: "/object3D_transforms",
  },
  {
    name: "Three.js Lights",
    path: "/lights",
  },
  {
    name: "Three.js Interaction GUI",
    path: "/interaction/gui",
  },
  {
    name: "Three.js Interaction Cubes",
    path: "/interaction/cubes",
  },
];

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-24'>
      {LIST.map((item) => (
        <Button key={item.path}>
          <Link href={item.path}>{item.name}</Link>
        </Button>
      ))}
    </main>
  );
}
