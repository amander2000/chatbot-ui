import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import { FC } from "react"

interface ChatScrollButtonsProps {
  isAtTop: boolean
  isAtBottom: boolean
  isOverflowing: boolean
  scrollToTop: () => void
  scrollToBottom: () => void
}

export const ChatScrollButtons: FC<ChatScrollButtonsProps> = ({
  isAtTop,
  isAtBottom,
  isOverflowing,
  scrollToTop,
  scrollToBottom
}) => {
  return (
    <>
      {!isAtTop && isOverflowing && (
        <IconArrowUp
          className="cursor-pointer opacity-40 hover:opacity-80"
          size={22}
          onClick={scrollToTop}
        />
      )}

      {!isAtBottom && isOverflowing && (
        <IconArrowDown
          className="cursor-pointer opacity-40 hover:opacity-80"
          size={22}
          onClick={scrollToBottom}
        />
      )}
    </>
  )
}
