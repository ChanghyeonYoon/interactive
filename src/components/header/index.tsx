import Link from "next/link";
import React from "react";
import { FpsView } from "react-fps";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className='h-20 relative px-10 pb-10 text-white text-2xl justify-center font-bold flex gap-4 items-center'>
      <div className='h-full flex items-center'>
        <h1>{title}</h1>
      </div>
      <FpsView width={150} height={80} top={5} />
      <Link className='absolute right-10 cursor-pointer' href={"/"}>
        Home
      </Link>
    </div>
  );
};

export default Header;
