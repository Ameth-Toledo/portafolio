"use client"

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronRight, FileText, Folder as FolderIcon, FolderOpen as FolderOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TreeViewElement = {
  id: string
  name: string
  isSelectable?: boolean
  children?: TreeViewElement[]
}

type TreeContextProps = {
  selectedId: string | undefined
  expendedItems: string[] | undefined
  indicator: boolean
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
  setExpendedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  direction: "rtl" | "ltr"
}

const TreeContext = createContext<TreeContextProps>({
  selectedId: undefined,
  expendedItems: undefined,
  indicator: true,
  handleExpand: () => {},
  selectItem: () => {},
  setExpendedItems: undefined,
  openIcon: undefined,
  closeIcon: undefined,
  direction: "ltr",
})

const useTree = () => {
  const context = useContext(TreeContext)
  if (!context) throw new Error("useTree must be used within a TreeProvider")
  return context
}

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type Direction = "rtl" | "ltr" | undefined

type TreeViewProps = {
  initialSelectedId?: string
  indicator?: boolean
  elements?: TreeViewElement[]
  initialExpendedItems?: string[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
} & TreeViewComponentProps

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpendedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      ...props
    },
    ref,
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId)
    const [expendedItems, setExpendedItems] = useState<string[] | undefined>(initialExpendedItems)

    const selectItem = useCallback((id: string) => {
      setSelectedId(id)
    }, [])

    const handleExpand = useCallback((id: string) => {
      setExpendedItems((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return [...(prev ?? []), id]
      })
    }, [])

    const expandSpecificTargetedElements = useCallback(
      (elements?: TreeViewElement[], selectId?: string): string[] => {
        if (!elements || !selectId) return []
        const findParent = (
          currentElement: TreeViewElement,
          currentPath: string[] = [],
        ): string[] => {
          const isTargetElement = currentElement.id === selectId
          if (isTargetElement) return currentPath
          if (!currentElement.children) return []
          for (const child of currentElement.children) {
            const result = findParent(child, [...currentPath, currentElement.id])
            if (result.length > 0) return result
          }
          return []
        }
        for (const element of elements) {
          const path = findParent(element)
          if (path.length > 0) return path
        }
        return []
      },
      [],
    )

    useEffect(() => {
      if (initialSelectedId) {
        const res = expandSpecificTargetedElements(elements, initialSelectedId)
        setExpendedItems((prev) => [...(prev ?? []), ...res])
      }
    }, [initialSelectedId, elements, expandSpecificTargetedElements])

    const direction = dir === "rtl" ? "rtl" : "ltr"

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expendedItems,
          handleExpand,
          selectItem,
          setExpendedItems,
          indicator,
          openIcon,
          closeIcon,
          direction,
        }}
      >
        <div className={cn("size-full", className)}>
          <AccordionPrimitive.Root
            {...props}
            type="multiple"
            defaultValue={expendedItems}
            value={expendedItems}
            className="flex flex-col gap-1"
            onValueChange={(value) => setExpendedItems((prev) => [...(prev ?? []), value[value.length - 1]])}
            dir={dir as Direction}
          >
            {children}
          </AccordionPrimitive.Root>
        </div>
      </TreeContext.Provider>
    )
  },
)
Tree.displayName = "Tree"

const TreeIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { direction } = useTree()
    return (
      <div
        dir={direction}
        ref={ref}
        className={cn(
          "absolute left-1.5 h-full w-px rounded-md bg-muted py-3 duration-300 ease-in-out hover:bg-slate-300 rtl:right-1.5",
          className,
        )}
        {...props}
      />
    )
  },
)
TreeIndicator.displayName = "TreeIndicator"

interface FolderComponentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

type FolderProps = {
  expendedItems?: string[]
  element: string
  isSelectable?: boolean
  isSelect?: boolean
  value: string
} & FolderComponentProps

const Folder = forwardRef<HTMLDivElement, FolderProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, element, value, isSelectable = true, isSelect, children, ...props }, ref) => {
    const {
      direction,
      handleExpand,
      expendedItems,
      indicator,
      setExpendedItems,
      openIcon,
      closeIcon,
    } = useTree()

    return (
      <AccordionPrimitive.Item {...props} value={value} className="relative h-full overflow-hidden">
        <AccordionPrimitive.Trigger
          className={cn(
            `flex items-center gap-1 rounded-md text-sm`,
            className,
            {
              "bg-muted rounded-md": isSelect && isSelectable,
              "cursor-pointer": isSelectable,
              "cursor-not-allowed opacity-50": !isSelectable,
            },
          )}
          disabled={!isSelectable}
          onClick={() => handleExpand(value)}
        >
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-accent-foreground/50 transition-transform duration-200",
              {
                "rotate-90": expendedItems?.includes(value),
                "rtl:rotate-180": direction === "rtl",
              },
            )}
          />
          {expendedItems?.includes(value)
            ? (openIcon ?? <FolderOpenIcon className="size-4 shrink-0 text-sky-500" />)
            : (closeIcon ?? <FolderIcon className="size-4 shrink-0 text-sky-500" />)}
          <span>{element}</span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="relative h-full overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="ml-5 flex flex-col gap-1 py-1 rtl:mr-5"
            defaultValue={expendedItems}
            value={expendedItems}
            onValueChange={(value) => {
              setExpendedItems?.((prev) => [...(prev ?? []), value[value.length - 1]])
            }}
          >
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  },
)
Folder.displayName = "Folder"

const File = forwardRef<HTMLButtonElement, { value: string; isSelectable?: boolean; isSelect?: boolean; fileIcon?: React.ReactNode } & React.HTMLAttributes<HTMLButtonElement>>(
  ({ value, className, isSelectable = true, isSelect, fileIcon, children, ...props }, ref) => {
    const { direction, selectedId, selectItem } = useTree()
    const isSelected = isSelect ?? selectedId === value
    return (
      <button
        ref={ref}
        type="button"
        disabled={!isSelectable}
        className={cn(
          "flex w-full items-center gap-1 rounded-md pr-1 text-sm duration-200 ease-in-out rtl:pl-1 rtl:pr-0",
          {
            "bg-muted": isSelected && isSelectable,
          },
          isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          direction === "rtl" ? "rtl" : "ltr",
          className,
        )}
        onClick={() => selectItem(value)}
        {...props}
      >
        {fileIcon ?? <FileText className="size-4 shrink-0 text-white/40" />}
        {children}
      </button>
    )
  },
)
File.displayName = "File"

const CollapseButton = forwardRef<
  HTMLButtonElement,
  { elements: TreeViewElement[]; expandAll?: boolean } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expendedItems, setExpendedItems } = useTree()

  const expendAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandTree = (element: TreeViewElement): string[] => {
      const children = element.children ? element.children.flatMap(expandTree) : []
      return [element.id, ...children]
    }
    return elements.flatMap(expandTree)
  }, [])

  const closeAll = useCallback(() => {
    setExpendedItems?.([])
  }, [setExpendedItems])

  useEffect(() => {
    if (expandAll) setExpendedItems?.(expendAllTree(elements))
  }, [expandAll, elements, expendAllTree, setExpendedItems])

  return (
    <button
      {...props}
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      onClick={expendedItems && expendedItems.length > 0 ? closeAll : () => setExpendedItems?.(expendAllTree(elements))}
    >
      {children}
    </button>
  )
})
CollapseButton.displayName = "CollapseButton"

export { CollapseButton, File, Folder, Tree, type TreeViewElement }
