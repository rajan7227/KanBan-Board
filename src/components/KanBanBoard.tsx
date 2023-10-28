import { PlusIcon } from "../icons/Plusicon";
import { useState, useMemo } from "react";
import { Column, Id, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

/**
 * KanBanBoard component renders the Kanban board.
 * It manages the state of the columns and handles drag and drop interactions to reorder columns.
 *
 * Key responsibilities:
 * - Renders ColumnContainer for each column
 * - Allows adding new columns
 * - Deletes columns
 * - Implements drag and drop handling with DND kit
 * - Handles reordering columns on drag end
 */
/**
 * KanBanBoard component renders the Kanban board.
 *
 * It manages the state of the columns and handles drag and drop sorting of the columns.
 *
 * Some key things it does:
 *
 * - Uses useState hook to store columns array and active column state.
 * - Uses useMemo to optimize column ids array.
 * - Renders columns with SortableContext for drag and drop.
 * - Handles drag start/end to update column order.
 * - Allows adding new columns.
 * - Allows deleting columns.
 * - Shows overlay of dragged column.
 */
function KanBanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
  const [tasks, setTasks] = useState<Task> ([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)

   const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance:3,
      },
    })
   );

  return (
    <div className="m-auto flex min-h-screen w-full items-center  overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="m-auto flex gap-4">
          <div className="flex  gap-4 ">
            <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={() => deleteColumn(col.id)}
                updateColumn={updateColumn} 
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task)=> task.columnId === col.id)}
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
          {activeColumn && (<ColumnContainer deleteTask={deleteTask} column={activeColumn} deleteColumn={deleteColumn} deleteTask={deleteTask}
                updateTask={updateTask} tasks={tasks.filter((task)=> task.columnId === activeColumn.id)}/>)}
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

  function onDragEnd (event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if( activeColumnId === overColumnId) return;
   
    const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
    const overColumnIndex = columns.findIndex((col)=> col.id === overColumnId);

    const updatedColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);

    setColumns(updatedColumns);
  }

  function updateColumn(id:Id , title: string) {
    const updatedColumns = columns.map((col) => {
     if (col.id === id){
      return { ...col, title};
     }
     return col;
    });
    setColumns(updatedColumns);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks?.length + 1}`
    }
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id:Id){
    const filteredTasks = tasks.map((task)=> task.id !== id);
    setTasks(filteredTasks);
  }

  function updateTask( id:Id , content: string){
    const newTasks = tasks.map((task)=> {
      if(task.id !==id) return task;
      return {...task, content}
    });

    setTasks(newTasks);
  }
}

export default KanBanBoard;
