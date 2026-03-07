"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ChatbotUIContext } from "@/context/context"
import { createWorkspace } from "@/db/workspaces"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useRouter } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { Input } from "../ui/input"

interface WorkspaceSwitcherProps {}

export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({}) => {
  useHotkey(";", () => setOpen(prevState => !prevState))

  const { workspaces, selectedWorkspace, setSelectedWorkspace, setWorkspaces } =
    useContext(ChatbotUIContext)

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!selectedWorkspace) return

    setValue(selectedWorkspace.id)
  }, [selectedWorkspace])

  const handleCreateWorkspace = async () => {
    if (!selectedWorkspace) return

    const createdWorkspace = await createWorkspace({
      user_id: selectedWorkspace.user_id,
      default_context_length: selectedWorkspace.default_context_length,
      default_model: selectedWorkspace.default_model,
      default_prompt: selectedWorkspace.default_prompt,
      default_temperature: selectedWorkspace.default_temperature,
      description: "",
      embeddings_provider: "openai",
      include_profile_context: selectedWorkspace.include_profile_context,
      include_workspace_instructions:
        selectedWorkspace.include_workspace_instructions,
      instructions: selectedWorkspace.instructions,
      is_home: false,
      name: "New Workspace"
    })

    setWorkspaces([...workspaces, createdWorkspace])
    setSelectedWorkspace(createdWorkspace)
    setOpen(false)

    return router.push(`/${createdWorkspace.id}/chat`)
  }

  const getWorkspaceName = (workspaceId: string) => {
    const workspace = workspaces.find(workspace => workspace.id === workspaceId)

    if (!workspace) return

    return workspace.name
  }

  const handleSelect = (workspaceId: string) => {
    const workspace = workspaces.find(workspace => workspace.id === workspaceId)

    if (!workspace) return

    setSelectedWorkspace(workspace)
    setOpen(false)

    return router.push(`/${workspace.id}/chat`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-[36px] w-full cursor-pointer items-center truncate px-2 py-1 text-sm font-medium hover:opacity-50">
        {getWorkspaceName(value) || "Select workspace..."}
      </PopoverTrigger>

      <PopoverContent className="p-2">
        <div className="space-y-2">
          {/* + New Workspace — plain clickable text */}
          <button
            className="flex w-full cursor-pointer items-center py-1 text-sm font-medium hover:opacity-70"
            onClick={handleCreateWorkspace}
          >
            + New Workspace
          </button>

          <Input
            placeholder="Search workspaces..."
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="flex flex-col space-y-1">
            {workspaces
              .filter(workspace => workspace.is_home)
              .map(workspace => (
                <button
                  key={workspace.id}
                  className="flex w-full items-center px-2 py-1.5 text-left text-sm font-semibold hover:opacity-50"
                  onClick={() => handleSelect(workspace.id)}
                >
                  {workspace.name}
                </button>
              ))}

            {workspaces
              .filter(
                workspace =>
                  !workspace.is_home &&
                  workspace.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(workspace => (
                <button
                  key={workspace.id}
                  className="flex w-full items-center px-2 py-1.5 text-left text-sm font-semibold hover:opacity-50"
                  onClick={() => handleSelect(workspace.id)}
                >
                  {workspace.name}
                </button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
