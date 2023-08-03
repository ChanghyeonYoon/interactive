import Link from "next/link";
import Image from "next/image";
import Arrow from "/public/icons/arrow.svg";
import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className='px-10 pb-10 text-white text-2xl font-bold flex gap-4 items-center'>
      <Link href={"/"}>
        <Image src={Arrow} alt={"go back"} width={36} height={36} />
      </Link>
      <h1>{title}</h1>
    </div>
  );
};

export default Header;
