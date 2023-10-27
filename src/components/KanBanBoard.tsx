import { PlusIcon } from "../icons/Plusicon";
import { useState, useMemo } from "react";
import { Column, Id, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanBanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)

  return (
    <div className="m-auto flex min-h-screen w-full items-center  overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext onDragStart={onDragStart}>
        <div className="m-auto flex gap-4">
          <div className="flex  gap-4 ">
            <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={() => deleteColumn(col.id)}
              />
            ))}
            </SortableContext>
          </div>

          <button
            onClick={() => {
              createColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-ross-500
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon /> Add Column
          </button>
        </div>
        { createPortal(<DragOverlay>
          {activeColumn && (<ColumnContainer column={activeColumn} deleteColumn={deleteColumn} />)}
        </DragOverlay>, document.body )}
      </DndContext>
    </div>
  );

  function createColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns?.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 10000);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function onDragStart (event: DragStartEvent ){
    console.log("DRAG START", event);
    if(event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }
}

export default KanBanBoard;
