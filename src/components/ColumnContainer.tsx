import { TrashIcon } from "../icons/TrashIcon";
import { Column } from "../types";

interface props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

export const ColumnContainer = (props: props) => {
  const { column, deleteColumn } = props;
  return (
    <div className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div className="flex items-center justify-between bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 ">
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
