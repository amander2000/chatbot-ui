"use client"

import Image from "next/image"
import { FC } from "react"

export const Brand: FC = () => {
  return (
    <div className="flex cursor-default flex-col items-center">
      <Image
        src="/DARK_BRAND_LOGO.png"
        alt="Avelli"
        width={1260}
        height={840}
        priority
      />
    </div>
  )
}
