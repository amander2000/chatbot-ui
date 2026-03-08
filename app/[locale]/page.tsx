"use client"

import { Brand } from "@/components/ui/brand"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { cn } from "@/lib/utils"
import { IconPaperclip, IconSend } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type InputMode = "default" | "humanize" | "write" | "summarize" | "strategize"

const MODE_CONFIG: {
  mode: InputMode
  label: string
  placeholder: string
}[] = [
  {
    mode: "humanize",
    label: "Humanize Text",
    placeholder: "Paste or upload your AI generated text"
  },
  {
    mode: "write",
    label: "Write",
    placeholder: "What are we creating?"
  },
  {
    mode: "summarize",
    label: "Summarize",
    placeholder: "Upload or Paste text to be summarized."
  },
  {
    mode: "strategize",
    label: "Strategize",
    placeholder: "Describe the situation or dynamics…"
  }
]

export default function HomePage() {
  const router = useRouter()

  const [inputMode, setInputMode] = useState<InputMode>("default")
  const [inputValue, setInputValue] = useState("")

  const placeholder =
    MODE_CONFIG.find(c => c.mode === inputMode)?.placeholder ??
    "Ask anything..."

  const goToLogin = () => router.push("/login")

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      goToLogin()
    }
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div className="absolute right-4 top-4 flex items-center space-x-4">
        <button
          type="button"
          onClick={goToLogin}
          className="cursor-pointer text-sm hover:opacity-70"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={goToLogin}
          className="cursor-pointer rounded-full bg-black px-4 py-1.5 text-sm text-white hover:opacity-70 dark:bg-white dark:text-black"
        >
          Sign Up
        </button>
      </div>
      <div className="flex w-full min-w-[300px] flex-col items-center px-2 sm:w-[600px] md:w-[700px] lg:w-[700px] xl:w-[800px]">
        <Brand width={630} height={420} />

        <div className="w-full pb-3 pt-0 sm:pb-8 sm:pt-5">
          {/* Input bar */}
          <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
            <IconPaperclip
              className="absolute bottom-[12px] left-3 cursor-pointer hover:opacity-50"
              size={24}
              strokeWidth={1.5}
              onClick={goToLogin}
            />

            <TextareaAutosize
              className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              value={inputValue}
              onValueChange={setInputValue}
              minRows={1}
              maxRows={18}
              onKeyDown={handleKeyDown}
            />

            <div
              className={cn(
                "absolute bottom-[14px] right-3",
                inputValue
                  ? "cursor-pointer hover:opacity-50"
                  : "cursor-not-allowed opacity-50"
              )}
            >
              <IconSend
                onClick={() => {
                  if (!inputValue) return
                  goToLogin()
                }}
                size={28}
              />
            </div>
          </div>

          {/* Mode buttons */}
          <div className="mt-3 flex justify-center space-x-3">
            {MODE_CONFIG.map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                aria-pressed={inputMode === mode}
                onClick={() =>
                  setInputMode(inputMode === mode ? "default" : mode)
                }
                className={cn(
                  mode === "strategize"
                    ? "strategize-btn cursor-pointer text-sm"
                    : "cursor-pointer rounded-full border border-black bg-transparent px-4 py-1.5 text-sm transition-opacity hover:opacity-70 dark:border-white",
                  inputMode === mode && "font-semibold"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
