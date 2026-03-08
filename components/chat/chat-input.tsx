import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import {
  IconBolt,
  IconPaperclip,
  IconPlayerStopFilled,
  IconSend
} from "@tabler/icons-react"
import Image from "next/image"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { ChatCommandInput } from "./chat-command-input"
import { ChatFilesDisplay } from "./chat-files-display"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { useChatHistoryHandler } from "./chat-hooks/use-chat-history"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { useSelectFileHandler } from "./chat-hooks/use-select-file-handler"

interface ChatInputProps {}

type InputMode = "default" | "humanize" | "write" | "summarize" | "strategize"

const STRATEGIZE_PROMPT = `You are a strategic advisor operating in the tradition of pragmatic political analysis. Your role is to provide calm, controlled, analytical guidance for navigating complex human environments — office politics, social situations, organizational hierarchies, power dynamics, and relationship dynamics.

Personality guidelines:
• Focus on incentives, leverage, hierarchy, reputation, alliances, and consequences.
• Avoid moralizing, lecturing, or emotional language.
• Prioritize realism and strategic outcomes over idealistic advice.
• Maintain a composed, disciplined tone.
• Assume human environments contain competing interests, hidden incentives, and informal power structures.

When responding, structure your analysis as follows:

1. Situation Assessment — briefly summarize what appears to be happening.
2. Power Map — identify relevant actors, their incentives, influence, and possible motivations.
3. Strategic Risks — explain the main risks if the situation is handled poorly.
4. Strategic Opportunities — identify leverage points, alliances, positioning strategies, or narrative advantages.
5. Recommended Approach — provide a calm, practical strategy for navigating the situation successfully.
6. Behavioral Guidance — suggest specific behaviors or tactics to adopt or avoid.

Constraints: do not encourage illegal activity, harassment, coercion, deception, or harm toward others. Focus on strategic awareness, reputation management, communication tactics, and situational intelligence.

Now analyze the following situation:`

export const ChatInput: FC<ChatInputProps> = ({}) => {
  const { t } = useTranslation()

  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [inputMode, setInputMode] = useState<InputMode>("default")

  const getPlaceholder = () => {
    switch (inputMode) {
      case "humanize":
        return t("Paste or upload your AI generated text")
      case "write":
        return t("What are we creating?")
      case "summarize":
        return t("Upload or Paste text to be summarized.")
      case "strategize":
        return t("Describe the situation or dynamics…")
      default:
        return t("Ask anything...")
    }
  }

  const getMessageToSend = (input: string) => {
    switch (inputMode) {
      case "humanize":
        return `Please revise the following AI-generated text to sound more natural and human-like:\n\n${input}`
      case "write":
        return `Please write the following in a natural, human-like writing style:\n\n${input}`
      case "summarize":
        return `Please provide a concise summary of the following text:\n\n${input}`
      case "strategize":
        return `${STRATEGIZE_PROMPT}\n\n${input}`
      default:
        return input
    }
  }

  const {
    isAssistantPickerOpen,
    focusAssistant,
    setFocusAssistant,
    userInput,
    chatMessages,
    isGenerating,
    selectedPreset,
    selectedAssistant,
    focusPrompt,
    setFocusPrompt,
    focusFile,
    focusTool,
    setFocusTool,
    isToolPickerOpen,
    isPromptPickerOpen,
    setIsPromptPickerOpen,
    isFilePickerOpen,
    setFocusFile,
    chatSettings,
    selectedTools,
    setSelectedTools,
    assistantImages
  } = useContext(ChatbotUIContext)

  const {
    chatInputRef,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput
  } = useChatHandler()

  const { handleInputChange } = usePromptAndCommand()

  const { filesToAccept, handleSelectDeviceFile } = useSelectFileHandler()

  const {
    setNewMessageContentToNextUserMessage,
    setNewMessageContentToPreviousUserMessage
  } = useChatHistoryHandler()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      handleFocusChatInput()
    }, 200) // FIX: hacky
  }, [selectedPreset, selectedAssistant])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      setIsPromptPickerOpen(false)
      handleSendMessage(getMessageToSend(userInput), chatMessages, false)
    }

    // Consolidate conditions to avoid TypeScript error
    if (
      isPromptPickerOpen ||
      isFilePickerOpen ||
      isToolPickerOpen ||
      isAssistantPickerOpen
    ) {
      if (
        event.key === "Tab" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault()
        // Toggle focus based on picker type
        if (isPromptPickerOpen) setFocusPrompt(!focusPrompt)
        if (isFilePickerOpen) setFocusFile(!focusFile)
        if (isToolPickerOpen) setFocusTool(!focusTool)
        if (isAssistantPickerOpen) setFocusAssistant(!focusAssistant)
      }
    }

    if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToPreviousUserMessage()
    }

    if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToNextUserMessage()
    }

    //use shift+ctrl+up and shift+ctrl+down to navigate through chat history
    if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToPreviousUserMessage()
    }

    if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToNextUserMessage()
    }

    if (
      isAssistantPickerOpen &&
      (event.key === "Tab" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown")
    ) {
      event.preventDefault()
      setFocusAssistant(!focusAssistant)
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const imagesAllowed = LLM_LIST.find(
      llm => llm.modelId === chatSettings?.model
    )?.imageInput

    const items = event.clipboardData.items
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        if (!imagesAllowed) {
          toast.error(
            `Images are not supported for this model. Use models like GPT-4 Vision instead.`
          )
          return
        }
        const file = item.getAsFile()
        if (!file) return
        handleSelectDeviceFile(file)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col flex-wrap justify-center gap-2">
        <ChatFilesDisplay />

        {selectedTools &&
          selectedTools.map((tool, index) => (
            <div
              key={index}
              className="flex justify-center"
              onClick={() =>
                setSelectedTools(
                  selectedTools.filter(
                    selectedTool => selectedTool.id !== tool.id
                  )
                )
              }
            >
              <div className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-purple-600 px-3 py-1 hover:opacity-50">
                <IconBolt size={20} />

                <div>{tool.name}</div>
              </div>
            </div>
          ))}

        {selectedAssistant && (
          <div className="border-primary mx-auto flex w-fit items-center space-x-2 rounded-lg border p-1.5">
            {selectedAssistant.image_path && (
              <Image
                className="rounded"
                src={
                  assistantImages.find(
                    img => img.path === selectedAssistant.image_path
                  )?.base64
                }
                width={28}
                height={28}
                alt={selectedAssistant.name}
              />
            )}

            <div className="text-sm font-bold">
              Talking to {selectedAssistant.name}
            </div>
          </div>
        )}
      </div>

      <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
          <ChatCommandInput />
        </div>

        <>
          <IconPaperclip
            className="absolute bottom-[12px] left-3 cursor-pointer hover:opacity-50"
            size={24}
            strokeWidth={1.5}
            onClick={() => fileInputRef.current?.click()}
          />

          {/* Hidden input to select files from device */}
          <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={e => {
              if (!e.target.files) return
              handleSelectDeviceFile(e.target.files[0])
            }}
            accept={filesToAccept}
          />
        </>

        <TextareaAutosize
          textareaRef={chatInputRef}
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={getPlaceholder()}
          onValueChange={handleInputChange}
          value={userInput}
          minRows={1}
          maxRows={18}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <IconPlayerStopFilled
              className="hover:bg-background animate-pulse rounded bg-transparent p-1"
              onClick={handleStopMessage}
              size={30}
            />
          ) : (
            <IconSend
              className={cn(!userInput && "cursor-not-allowed opacity-50")}
              onClick={() => {
                if (!userInput) return

                handleSendMessage(
                  getMessageToSend(userInput),
                  chatMessages,
                  false
                )
              }}
              size={28}
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-center space-x-3">
        {(
          [
            { mode: "humanize", label: "Humanize Text" },
            { mode: "write", label: "Write" },
            { mode: "summarize", label: "Summarize" },
            { mode: "strategize", label: "Strategize" }
          ] as { mode: InputMode; label: string }[]
        ).map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            aria-pressed={inputMode === mode}
            onClick={() => setInputMode(inputMode === mode ? "default" : mode)}
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
    </>
  )
}
