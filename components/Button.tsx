import React, { PropsWithChildren  } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button(props: PropsWithChildren<ButtonProps>) {
  const { className, variant, ...propsWithoutClassName } = props;
  const additionalClasses = className ? ` ${className}` : '';

  const variantClasses = {
    primary: "bg-sky-800 hover:bg-sky-900 disabled:bg-sky-900 text-white",
    secondary: "bg-gray-600 hover:bg-gray-500 disabled:bg-gray-600 text-white",
    danger: "bg-red-800 hover:bg-red-900 disabled:bg-red-900 text-white",
  }

  return (
    <button className={
      ` ${variantClasses[variant || 'primary']} px-4 py-2 cursor-pointer transition-[colors, opacity] duration-300 disabled:opacity-50 disabled:cursor-not-allowed`
      + additionalClasses
    } {...propsWithoutClassName}>
      {props.children}
    </button>
  )
}
export default Button