"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"

export const SIDEBAR_WIDTH = 350

// 3× the AVELLI chat-message monogram (AVELLI_HEIGHT=56, AVELLI_WIDTH=64)
const TOGGLE_MONOGRAM_HEIGHT = 168
const TOGGLE_MONOGRAM_WIDTH = 192

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const { handleSelectDeviceFile } = useSelectFileHandler()

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
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
        {showSidebar && (
          <Tabs
            className="flex h-full"
            value={contentType}
            onValueChange={tabValue => {
              setContentType(tabValue as ContentType)
              router.replace(`${pathname}?tab=${tabValue}`)
            }}
          >
            <SidebarSwitcher onContentTypeChange={setContentType} />

            <Sidebar contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        )}
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

        {/* AVELLI monogram in top-left — replaces the old ">" chevron button */}
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
