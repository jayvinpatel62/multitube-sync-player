import React from "react";

export const Button = ({ children, onClick, variant = "default" }) => {
  const base = "px-4 py-2 rounded text-white font-semibold transition";
  const styles = {
    default: "bg-blue-600 hover:bg-blue-700",
    destructive: "bg-red-600 hover:bg-red-700",
    outline: "bg-white text-black border border-gray-300 hover:bg-gray-100"
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
};
