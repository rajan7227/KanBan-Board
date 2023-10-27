import { TrashIcon } from "../icons/TrashIcon";
import { Column } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

export const ColumnContainer = (props: props) => {
  const { column, deleteColumn, updateColumn } = props;
  const [ editMode, setEditMode ] = useState(false)

    const {setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
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
    <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div {...attributes} {...listeners} onClick={()=> setEditMode(true)} className="flex items-center justify-between bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 ">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && <input 
          className="bg-black focus:ring-violet-300 rounded-md outline-none px-2"
          autoFocus 
          onKeyDown={(e)=>{ if (e.key !== "Enter") return;
            setEditMode(false)}} 
          onBlur={()=>setEditMode(false)}
          onChange={(e) => updateColumn(column.id, e.target.value)}
          />}
        </div>
        <button onClick={()=>{deleteColumn(column.id)}} className="flex justify-center items-center gap-2"> <TrashIcon /></button>
      </div>
    </div>
  );
};
