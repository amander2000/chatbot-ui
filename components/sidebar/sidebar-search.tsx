import { ContentType } from "@/types"
import { FC } from "react"
import { Input } from "../ui/input"

interface SidebarSearchProps {
  contentType: ContentType
  searchTerm: string
  setSearchTerm: Function
}

export const SidebarSearch: FC<SidebarSearchProps> = ({
  contentType,
  searchTerm,
  setSearchTerm
}) => {
  const placeholder =
    contentType === "chats" ? "Search History" : `Search ${contentType}...`

  return (
    <Input
      placeholder={placeholder}
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  )
}
