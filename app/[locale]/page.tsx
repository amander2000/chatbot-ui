"use client"

import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <Image
          src="/DARK_BRAND_LOGO.png"
          alt="Avelli"
          width={1200}
          height={800}
          priority
        />
      </div>

      <Link
        className="mt-4 text-2xl font-semibold hover:opacity-70"
        href="/login"
      >
        Enter AVELLI
      </Link>
    </div>
  )
}
