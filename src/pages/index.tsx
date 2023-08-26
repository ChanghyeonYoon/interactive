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
  // {
  //   name: "Three.js Interaction GUI",
  //   path: "/interaction/gui",
  // },
  {
    name: "Three.js Interaction Cubes",
    path: "/interaction/cubes",
  },
  {
    name: "Demo - Three.js & GSAP",
    path: "/demo",
  },
];

export default function Home() {
  return (
    <main className='flex w-screen min-h-screen flex-col items-center gap-5 p-24 max-lg:p-5'>
      <div className='w-full gap-5 flex flex-col items-center'>
        {LIST.map((item) => (
          <Button key={item.path}>
            <Link href={item.path}>{item.name}</Link>
          </Button>
        ))}
      </div>

      <div className='mt-20 w-full justify-center items-center flex gap-10 max-lg:flex-col max-lg:gap-5'>
        <span className='text-3xl'>Github</span>
        <a
          className='underline text-blue-500 hover:text-blue-800 text-xl max-lg:text-sm'
          href={"https://github.com/ChanghyeonYoon/interactive"}
          target='_blank'
        >
          https://github.com/ChanghyeonYoon/interactive
        </a>
      </div>
    </main>
  );
}
