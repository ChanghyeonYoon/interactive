import Link from "next/link";
import React from "react";
import { FpsView } from "react-fps";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className='h-20 absolute top-0 w-screen px-10 text-white text-2xl justify-center font-bold flex gap-4 items-center z-50 max-lg:text-sm max-lg:px-5 max-lg:h-10 bg-[#00000050]'>
      <div className='flex items-center'>
        <h1>{title}</h1>
      </div>
      <div className='max-lg:hidden'>
        <FpsView width={150} height={80} top={5} />
      </div>
      <Link className='absolute right-10 cursor-pointer max-lg:right-5' href={"/"}>
        Home
      </Link>
    </div>
  );
};

export default Header;
