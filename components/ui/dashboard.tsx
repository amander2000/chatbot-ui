"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { FC, useState } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"

export const SIDEBAR_WIDTH = 350

// 50% of the previous 3× chat-monogram size (192×168 → 96×84)
const TOGGLE_MONOGRAM_HEIGHT = 84
const TOGGLE_MONOGRAM_WIDTH = 96

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const { handleSelectDeviceFile } = useSelectFileHandler()

  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )
  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const files = event.dataTransfer.files
    const file = files[0]

    handleSelectDeviceFile(file)

    setIsDragging(false)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  return (
    <div className="flex size-full">
      <CommandK />

      <div
        className={cn(
          "duration-200 dark:border-none " + (showSidebar ? "border-r-2" : "")
        )}
        style={{
          // Sidebar
          minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
        }}
      >
        {showSidebar && <Sidebar showSidebar={showSidebar} />}
      </div>

      <div
        className="bg-muted/50 relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit"
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {isDragging ? (
          <div className="flex h-full items-center justify-center bg-black/50 text-2xl text-white">
            drop file here
          </div>
        ) : (
          children
        )}

        {/* AVELLI monogram in top-left — toggles sidebar */}
        <button
          className="absolute left-2 top-2 z-10 cursor-pointer opacity-80 hover:opacity-60"
          onClick={handleToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Image
            src="/icon-192x192.png"
            alt="AVELLI"
            width={TOGGLE_MONOGRAM_WIDTH}
            height={TOGGLE_MONOGRAM_HEIGHT}
            style={{
              width: `${TOGGLE_MONOGRAM_WIDTH}px`,
              height: `${TOGGLE_MONOGRAM_HEIGHT}px`,
              objectFit: "contain"
            }}
            priority
          />
        </button>
      </div>
    </div>
  )
}
