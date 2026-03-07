"use client"

import Image from "next/image"
import { FC } from "react"

interface BrandProps {
  width?: number
  height?: number
}

export const Brand: FC<BrandProps> = ({ width = 1260, height = 840 }) => {
  return (
    <div className="flex cursor-default flex-col items-center">
      <Image
        src="/DARK_BRAND_LOGO.png"
        alt="Avelli"
        width={width}
        height={height}
        priority
      />
    </div>
  )
}
