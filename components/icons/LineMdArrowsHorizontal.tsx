import React, { SVGProps } from 'react'

export function LineMdArrowsHorizontal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt */}<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="14" strokeDashoffset="14" d="M15 7h-11.5M9 17h11.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="14;0" /></path><path strokeDasharray="8" strokeDashoffset="8" d="M3 7l4 4M3 7l4 -4M21 17l-4 4M21 17l-4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" values="8;0" /></path></g></svg>
  )
}
export default LineMdArrowsHorizontal