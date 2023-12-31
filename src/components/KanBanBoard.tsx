import { PlusIcon } from "../icons/Plusicon";
import { useState, useMemo, useEffect } from "react";
import { Column, Id, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard";

const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo \u{1F4C5}",
  },
  {
    id: "doing",
    title: "Work in progress \u{1F680}",
  },
  {
    id: "done",
    title: "Done \u{2705}",
  },
  {
    id: "review",
    title: "Review \u{1F4DD}",
  }
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content: "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "todo",
    content: "Create a design mockup for the user dashboard",
  },
  {
    id: "5",
    columnId: "doing",
    content: "Implement user authentication using JWT",
  },
  {
    id: "6",
    columnId: "done",
    content: "Write documentation for API endpoints",
  },
  {
    id: "7",
    columnId: "todo",
    content: "Define data models for user profiles",
  },
  {
    id: "8",
    columnId: "doing",
    content: "Set up a continuous integration pipeline",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Create a database schema for user data",
  },
  {
    id: "10",
    columnId: "doing",
    content: "Implement password reset functionality",
  },
  {
    id: "11",
    columnId: "done",
    content: "Optimize database queries for performance",
  },
  {
    id: "12",
    columnId: "todo",
    content: "Develop a user profile page UI",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Integrate third-party authentication providers",
  },
  {
    id: "14",
    columnId: "done",
    content: "Refactor code for improved maintainability",
  },
  {
    id: "15",
    columnId: "todo",
    content: "Create unit tests for user registration",
  },
  
];


function KanBanBoard() {
  const localStorageKey = "KanBanBoard-State";
  const savedData = JSON.parse(localStorage.getItem(localStorageKey)) || { columns: defaultCols, tasks: defaultTasks };
  const initialColumns = savedData.columns;
  const initialTasks = savedData.tasks;
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task>(initialTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

//Saving the Column and Task in the local storage
  useEffect(()=>{
    localStorage.setItem(localStorageKey, JSON.stringify({ columns, tasks }));
  },[columns,tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className="m-auto flex min-h-screen w-full items-center  overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
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
                  tasks={tasks.filter((task) => task.columnId === col.id)}
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
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                deleteTask={deleteTask}
                column={activeColumn}
                deleteColumn={deleteColumn}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
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

  function onDragStart(event: DragStartEvent) {
    console.log("DRAG START", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    const updatedColumns = arrayMove(
      columns,
      activeColumnIndex,
      overColumnIndex
    );

    setColumns(updatedColumns);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function updateColumn(id: Id, title: string) {
    const updatedColumns = columns.map((col) => {
      if (col.id === id) {
        return { ...col, title };
      }
      return col;
    });
    setColumns(updatedColumns);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks?.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const filteredTasks = tasks.map((task) => task.id !== id);
    setTasks(filteredTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }
}

export default KanBanBoard;
