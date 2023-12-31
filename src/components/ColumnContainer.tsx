import { TrashIcon } from "../icons/TrashIcon";
import { Column } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { AddTask } from "../icons/AddTask";
import { TaskCard } from "./TaskCard";
import { Task, Id } from "../types";

interface props {
  column: Column;
  deleteColumn: (id: Id) => void;
  createTask: (columnId: string) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string ) => void;
}

export const ColumnContainer = (props: props) => {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } =
    props;
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const tasksIds = useMemo (()=>{
    return tasks.map(task => task.id)
  },[tasks]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-columnBackgroundColor
          opacity-40
          border-2
          border-pink-500
          w-[350px]
          h-[500px]
          max-h-[500px]
          rounded-md
          flex
          flex-col
          "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex  justify-between flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="flex items-center justify-between bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 "
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:ring-violet-300 rounded-md outline-none px-2"
              autoFocus
              value={column.title}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              onBlur={() => setEditMode(false)}
              onChange={(e) => updateColumn(column.id, e.target.value)}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="flex justify-center items-center gap-2"
        >
          {" "}
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-2 p-2 overflow-x-hidden oveflow-y-auto">
          <SortableContext items={tasksIds}>
          {tasks.map((task) => (
          <TaskCard updateTask={updateTask} deleteTask={deleteTask} key={task.id} task={task} />
        ))}
        </SortableContext>
      </div>
      <button
        className="  flex justify-center gap-2 py-3 items-center "
        onClick={() => createTask(column.id)}
      >
        {" "}
        <AddTask /> Add Task
      </button>
    </div>
  );
};
