import React, { PropsWithChildren  } from 'react'

export function Button(props: PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  const additionalClasses = props.className ? ` ${props.className}` : "";
  const propsWithoutClassName = { ...props };
  
  delete propsWithoutClassName.className;

  return (
    <button className={
      "bg-gray-600 px-4 py-2 text-white cursor-pointer hover:bg-gray-500 transition-[colors, opacity] duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-600" 
      + additionalClasses
    } {...propsWithoutClassName}>
      {props.children}
    </button>
  )
}
export default Button