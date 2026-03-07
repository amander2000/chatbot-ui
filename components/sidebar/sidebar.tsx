import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { SIDEBAR_WIDTH } from "../ui/dashboard"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"

interface SidebarProps {
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ showSidebar }) => {
  const { folders, chats } = useContext(ChatbotUIContext)

  const chatFolders = folders.filter(folder => folder.type === "chats")

  return (
    <div
      className="flex h-full flex-col"
      style={{
        minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
        maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
        width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
      }}
    >
      <div className="flex h-full flex-col p-3">
        {/* Header: workspace switcher + settings gear + profile avatar */}
        <div className="flex items-center border-b-2 pb-2">
          <WorkspaceSwitcher />

          <WorkspaceSettings />

          <WithTooltip
            display={<div>Profile Settings</div>}
            trigger={<ProfileSettings />}
          />
        </div>

        <div className="flex min-h-0 grow flex-col">
          <SidebarContent
            contentType="chats"
            data={chats}
            folders={chatFolders}
          />
        </div>
      </div>
    </div>
  )
}
