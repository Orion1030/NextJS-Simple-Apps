"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  MoreVertical,
  Info,
  Plus,
  FileText,
  CheckCircle,
  Flag,
  Edit2,
  Copy,
  Files,
  Trash2,
  X,
  Check,
} from "lucide-react";

interface Page {
  id: string;
  name: string;
  iconKey: string;
  isFirst?: boolean;
}

// Custom hook for managing drag and drop functionality
const useDragAndDrop = (
  pages: Page[],
  setPages: React.Dispatch<React.SetStateAction<Page[]>>
) => {
  const [draggedPage, setDraggedPage] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, pageId: string) => {
    setDraggedPage(pageId);
    e.dataTransfer.effectAllowed = "move";

    const draggedElement = e.currentTarget as HTMLElement;

    const rect = draggedElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clone = draggedElement.cloneNode(true) as HTMLElement;
    clone.style.transform = "rotate(5deg)";
    clone.style.opacity = "0.9";
    clone.style.position = "absolute";
    clone.style.pointerEvents = "none";
    clone.style.top = "-9999px";
    document.body.appendChild(clone);

    e.dataTransfer.setDragImage(clone, x, y);

    setTimeout(() => {
      document.body.removeChild(clone);
    }, 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();

      if (!draggedPage) return;

      const draggedIndex = pages.findIndex((p) => p.id === draggedPage);
      if (draggedIndex === -1) return;

      const newPages = [...pages];
      const [draggedItem] = newPages.splice(draggedIndex, 1);
      newPages.splice(dropIndex, 0, draggedItem);

      newPages.forEach((page, index) => {
        page.isFirst = index === 0;
      });

      setPages(newPages);
      setDraggedPage(null);
      setDragOverIndex(null);
    },
    [draggedPage, pages, setPages]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedPage(null);
    setDragOverIndex(null);
  }, []);

  return {
    draggedPage,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};

// Custom hook for context menu functionality
const useContextMenu = () => {
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, pageId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(pageId);
    },
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    showContextMenu,
    contextMenuPosition,
    contextMenuRef,
    handleContextMenu,
    setShowContextMenu,
  };
};

// Custom hook for page editing functionality
const usePageEditing = (
  pages: Page[],
  setPages: React.Dispatch<React.SetStateAction<Page[]>>
) => {
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPage && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingPage]);

  const startRename = useCallback(
    (pageId: string) => {
      const page = pages.find((p) => p.id === pageId);
      if (page) {
        // setEditingPage("1");
        setEditingPage(pageId);
        setEditingName(page.name);
      }
    },
    [pages]
  );

  const confirmRename = useCallback(() => {
    if (editingPage && editingName.trim()) {
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === editingPage ? { ...page, name: editingName.trim() } : page
        )
      );
    }
    setEditingPage(null);
    setEditingName("");
  }, [editingPage, editingName, setPages]);

  const cancelRename = useCallback(() => {
    setEditingPage(null);
    setEditingName("");
  }, []);

  return {
    editingPage,
    editingName,
    editInputRef,
    startRename,
    confirmRename,
    cancelRename,
    setEditingName,
  };
};

// Memoized color utility function
const getColors = (active: boolean, focused: boolean) => {
  return active || focused ? "text-orange-500" : "text-gray-500";
};

// Memoized page icons configuration
const PAGE_ICONS = [
  {
    key: "info",
    render: (active: boolean, focused: boolean) => (
      <Info className={`${getColors(active, focused)} w-5 mr-1.5 `} />
    ),
  },
  {
    key: "details",
    render: (active: boolean, focused: boolean) => (
      <FileText className={`${getColors(active, focused)} w-5 mr-1.5 `} />
    ),
  },
  {
    key: "file",
    render: (active: boolean, focused: boolean) => (
      <FileText className={`${getColors(active, focused)} w-5 mr-1.5 `} />
    ),
  },
  {
    key: "check",
    render: (active: boolean, focused: boolean) => (
      <CheckCircle className={`${getColors(active, focused)} w-5 mr-1.5 `} />
    ),
  },
];
const speratorItem = (
  <div className="flex items-center m-0 text-nowrap">
    <div
      key={`left-dot`}
      className="text-gray-300 transition-all duration-300 ease-in-out"
    >
      ----
    </div>
  </div>
);

export default function PageNavigation() {
  const [pages, setPages] = useState<Page[]>([
    { id: "1", name: "Info", iconKey: "info", isFirst: true },
    { id: "2", name: "Details", iconKey: "details" },
    { id: "3", name: "Other", iconKey: "file" },
    { id: "4", name: "Ending", iconKey: "check" },
  ]);

  const [activePage, setActivePage] = useState("1");
  const [focusedPage, setFocusedPage] = useState<string | null>(null);
  const [hoveredSeparator, setHoveredSeparator] = useState<number | null>(null);

  // Custom hooks
  const dragAndDrop = useDragAndDrop(pages, setPages);
  const contextMenu = useContextMenu();
  const pageEditing = usePageEditing(pages, setPages);

  // Memoized page operations
  const pageOperations = useMemo(
    () => ({
      addNewPage: (afterIndex: number) => {
        const newPage: Page = {
          id: Date.now().toString(),
          name: `Page ${pages.length + 1}`,
          iconKey: "file",
        };

        const newPages = [...pages];
        newPages.splice(afterIndex + 1, 0, newPage);
        setPages(newPages);
      },

      setAsFirstPage: (pageId: string) => {
        const pageIndex = pages.findIndex((p) => p.id === pageId);
        if (pageIndex === -1 || pageIndex === 0) return;

        const newPages = [...pages];
        const [pageToMove] = newPages.splice(pageIndex, 1);
        newPages.unshift(pageToMove);

        newPages.forEach((page, index) => {
          page.isFirst = index === 0;
        });

        setPages(newPages);
        contextMenu.setShowContextMenu(null);
      },

      copyPage: (pageId: string) => {
        const pageIndex = pages.findIndex((p) => p.id === pageId);
        if (pageIndex === -1) return;

        const originalPage = pages[pageIndex];
        const copiedPage: Page = {
          ...originalPage,
          id: Date.now().toString(),
          name: `${originalPage.name} Copy`,
          isFirst: false,
        };

        const newPages = [...pages];
        newPages.splice(pageIndex + 1, 0, copiedPage);
        setPages(newPages);
        contextMenu.setShowContextMenu(null);
      },

      duplicatePage: (pageId: string) => {
        const pageIndex = pages.findIndex((p) => p.id === pageId);
        if (pageIndex === -1) return;

        const originalPage = pages[pageIndex];
        const duplicatedPage: Page = {
          ...originalPage,
          id: Date.now().toString(),
          name: `${originalPage.name} (2)`,
          isFirst: false,
        };

        const newPages = [...pages];
        newPages.splice(pageIndex + 1, 0, duplicatedPage);
        setPages(newPages);
        contextMenu.setShowContextMenu(null);
      },

      deletePage: (pageId: string) => {
        if (pages.length <= 1) {
          alert("Cannot delete the last page");
          return;
        }

        const newPages = pages.filter((p) => p.id !== pageId);

        if (newPages.length > 0) {
          newPages[0].isFirst = true;
        }

        if (activePage === pageId) {
          setActivePage(newPages[0]?.id || "");
        }

        setPages(newPages);
        contextMenu.setShowContextMenu(null);
      },
    }),
    [pages, activePage, contextMenu]
  );

  // Memoized context menu items
  const contextMenuItems = useMemo(
    () => [
      { label: "Settings", isHeader: true },
      { separator: true },
      {
        label: "Set as first page",
        icon: <Flag className="w-4 h-4 text-blue-500" />,
        action: () =>
          pageOperations.setAsFirstPage(contextMenu.showContextMenu!),
      },
      {
        label: "Rename",
        icon: <Edit2 className="w-4 h-4 text-gray-500" />,
        action: () => {
          pageEditing.startRename(contextMenu.showContextMenu!);
          contextMenu.setShowContextMenu(null);
        },
      },
      {
        label: "Copy",
        icon: <Copy className="w-4 h-4 text-gray-500" />,
        action: () => pageOperations.copyPage(contextMenu.showContextMenu!),
      },
      {
        label: "Duplicate",
        icon: <Files className="w-4 h-4 text-gray-500" />,
        action: () =>
          pageOperations.duplicatePage(contextMenu.showContextMenu!),
      },
      { separator: true },
      {
        label: "Delete",
        icon: <Trash2 className="w-4 h-4 text-red-500" />,
        action: () => pageOperations.deletePage(contextMenu.showContextMenu!),
        danger: true,
      },
    ],
    [contextMenu.showContextMenu, pageOperations, pageEditing]
  );

  // Memoized page button class calculation
  const getPageButtonClass = useCallback(
    (page: Page, isHovered = false) => {
      if (focusedPage === page.id) return "page-button-active";
      if (activePage === page.id) return "page-button-focused";
      if (isHovered) return "page-button-hover";
      return "page-button-default";
    },
    [focusedPage, activePage]
  );

  // Event handlers
  const handlePageClick = useCallback(
    (pageId: string) => {
      if (pageEditing.editingPage !== pageId) {
        setActivePage(pageId);
        console.log("Page activated:", pageId);
      }
    },
    [pageEditing.editingPage]
  );

  const handlePageFocus = useCallback((pageId: string) => {
    console.log("Page focused:", pageId);
    setFocusedPage(pageId);
  }, []);

  const handlePageBlur = useCallback((pageId: string, e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest(".triple-dots")) {
      console.log("Page blurred:", pageId);
      setFocusedPage(null);
    }
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, page: Page) => {
      if (activePage !== page.id && focusedPage !== page.id) {
        e.currentTarget.className = e.currentTarget.className.replace(
          "page-button-default",
          "page-button-hover"
        );
      }
    },
    [activePage, focusedPage]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, page: Page) => {
      if (activePage !== page.id && focusedPage !== page.id) {
        e.currentTarget.className = e.currentTarget.className.replace(
          "page-button-hover",
          "page-button-default"
        );
      }
    },
    [activePage, focusedPage]
  );

  // Memoized current page name
  const currentPageName = useMemo(
    () => pages.find((p) => p.id === activePage)?.name || "Unknown",
    [pages, activePage]
  );

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {pages.map((page, index) => (
            <React.Fragment key={page.id}>
              {/* Page Tab */}
              <motion.div
                layout // enables FLIP animations (reorder/move)
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 34,
                  duration: 0.28,
                }}
                className={`
                  page-button
                  ${getPageButtonClass(page)} 
                  ${dragAndDrop.draggedPage === page.id ? "drag-preview" : ""}
                  ${dragAndDrop.dragOverIndex === index ? "drag-over" : ""}
                `}
                draggable={pageEditing.editingPage !== page.id}
                onDragStart={(e) => dragAndDrop.handleDragStart(e, page.id)}
                onDragOver={(e) => dragAndDrop.handleDragOver(e, index)}
                onDragLeave={dragAndDrop.handleDragLeave}
                onDrop={(e) => dragAndDrop.handleDrop(e, index)}
                onDragEnd={dragAndDrop.handleDragEnd}
                onClick={() => handlePageClick(page.id)}
                onFocus={() => handlePageFocus(page.id)}
                onBlur={(e) => handlePageBlur(page.id, e)}
                onMouseEnter={(e) => handleMouseEnter(e, page)}
                onMouseLeave={(e) => handleMouseLeave(e, page)}
                tabIndex={0}
              >
                <div className="page-frame">
                  {(() => {
                    const iconEntry = PAGE_ICONS.find(
                      (ic) => ic.key === page.iconKey
                    )!;
                    return iconEntry.render(
                      activePage === page.id,
                      focusedPage === page.id
                    );
                  })()}

                  {/* Editable name or regular name */}
                  {pageEditing.editingPage === page.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={pageEditing.editInputRef}
                        type="text"
                        value={pageEditing.editingName}
                        onChange={(e) =>
                          pageEditing.setEditingName(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") pageEditing.confirmRename();
                          if (e.key === "Escape") pageEditing.cancelRename();
                        }}
                        onBlur={pageEditing.confirmRename}
                        className="text-sm text-gray-700 font-medium bg-transparent border-b border-blue-500 outline-none min-w-0 w-16"
                      />
                      <button
                        onClick={pageEditing.confirmRename}
                        className="p-0.5 hover:bg-green-100 rounded text-green-600"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={pageEditing.cancelRename}
                        className="p-0.5 hover:bg-red-100 rounded text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm mt-1 font-bold text-gray-700 truncate">
                      {page.name}
                    </span>
                  )}
                </div>
                {/* 3-dot menu for active page */}
                {activePage === page.id &&
                  focusedPage === page.id &&
                  pageEditing.editingPage !== page.id && (
                    <button
                      className="triple-dots ml-2 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        contextMenu.handleContextMenu(e, page.id);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      tabIndex={-1}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
              </motion.div>

              {/* Dotted Separator with hover add button */}
              {index < pages.length - 1 ? (
                <div
                  className="page-frame relative flex items-center"
                  onMouseEnter={() =>
                    !pageEditing.editingPage && setHoveredSeparator(index)
                  }
                  onMouseLeave={() => setHoveredSeparator(null)}
                >
                  {speratorItem}
                  {hoveredSeparator === index && (
                    <button
                      className="m-0 flex items-center justify-center w-5 h-5 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                      onClick={() => pageOperations.addNewPage(index)}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                  {hoveredSeparator === index && speratorItem}
                </div>
              ) : (
                speratorItem
              )}
            </React.Fragment>
          ))}

          {/* Add Page Button */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 34,
              duration: 0.4,
            }}
          >
            <button
              className="page-button page-button-active flex items-center px-3 py-2  text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
              onClick={() => pageOperations.addNewPage(pages.length - 1)}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="text-sm mt-1 font-bold text-nowrap">
                Add page
              </span>
            </button>
          </motion.div>
        </div>

        {/* Context Menu */}
        {contextMenu.showContextMenu && (
          <div
            ref={contextMenu.contextMenuRef}
            className="dropdown-menu fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              left: contextMenu.contextMenuPosition.x,
              top: contextMenu.contextMenuPosition.y,
            }}
          >
            <div className="dropdown-header">Settings</div>

            {contextMenuItems.slice(2).map((item, index) => {
              if (item.separator) {
                return <div key={index} className="dropdown-separator" />;
              }

              return (
                <button
                  key={index}
                  className={`dropdown-button ${item.danger ? "danger" : ""}`}
                  onClick={() => item.action?.()}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Demo Content */}
        <div className="mt-12 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Demo: {currentPageName} Optimizations
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>✅ Recent Improvements in This Component:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Custom Hooks:</strong> Drag-and-drop, context menu, and
                editing logic are now managed with reusable hooks
              </li>
              <li>
                <strong>Memoization:</strong> useMemo and useCallback help
                reduce unnecessary re-renders in the UI
              </li>
              <li>
                <strong>Performance:</strong> Event handlers and state updates
                have been streamlined for efficiency
              </li>
              <li>
                <strong>Code Organization:</strong> Improved modularization and
                clearer component structure
              </li>
              <li>
                <strong>Memory Management:</strong> Enhanced cleanup logic has
                reduced potential memory leaks
              </li>
            </ul>
            <p className="mt-4">
              <strong>Original features retained:</strong> All drag-and-drop,
              context menus, inline editing, and appearance remain unchanged for
              users.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
