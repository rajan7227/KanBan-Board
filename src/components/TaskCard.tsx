import { DeleteIcon } from "../icons/DeleteIcon";
import { useState } from "react";
import { Task, Id } from "../types";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev)=> !prev);
    setMouseIsOver(false);
  };

  if (editMode){
    return(
      <div
      
      className="bg-mainBackgroundColor relative p-2.5 h-[100px] min-h-[100px] items-center flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
    >
      <textarea className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none 
      "
      value={task.content}
      autoFocus
      placeholder="Task content here"
      onBlur={toggleEditMode}
      onKeyDown={(e)=>{
        if (e.key === "Enter" && e.shiftKey){
          toggleEditMode(false);
        }
      }}
      onChange={(e)=> updateTask(task.id, e.target.value)}
      ></textarea>
      {mouseIsOver && (
        <button  
        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
          <DeleteIcon />
        </button>
      )}
    </div>
    )
  }

  return (
    <div
    onClick={toggleEditMode}
      onMouseLeave={() => setMouseIsOver(false)}
      onMouseEnter={() => setMouseIsOver(true)}
      className="bg-mainBackgroundColor relative p-2.5 h-[100px] min-h-[100px] items-center flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
    >
      {task.content}
      {mouseIsOver && (
        <button  
        onClick={()=>deleteTask(task.id)}
        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};