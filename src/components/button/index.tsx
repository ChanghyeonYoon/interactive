import React from "react";

interface ButtonProps {
  children: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({ children }) => {
  return <div className='px-6 py-3 bg-blue-200 rounded-lg text-3xl shadow-xl'>{children}</div>;
};

export default Button;
