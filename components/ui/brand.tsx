"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { FC, useEffect, useState } from "react"

interface BrandProps {
  width?: number
  height?: number
}

export const Brand: FC<BrandProps> = ({ width = 1260, height = 840 }) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/LIGHT_BRAND_LOGO.png"
      : "/DARK_BRAND_LOGO.png"

  return (
    <div className="brand-halo-wrapper flex cursor-default flex-col items-center">
      <div className="brand-halo" aria-hidden="true" />
      <Image
        src={logoSrc}
        alt="Avelli"
        width={width}
        height={height}
        priority
        className="relative z-10"
      />
    </div>
  )
}
