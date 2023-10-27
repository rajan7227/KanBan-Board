import { TrashIcon } from "../icons/TrashIcon";
import { Column } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

export const ColumnContainer = (props: props) => {
  const { column, deleteColumn } = props;

    const {setNodeRef, attributes, listeners, transform, transition } = useSortable({
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

  return (
    <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div {...attributes} {...listeners} className="flex items-center justify-between bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 ">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        <button onClick={()=>{deleteColumn(column.id)}} className="flex justify-center items-center gap-2"> <TrashIcon /></button>
      </div>
    </div>
  );
};
