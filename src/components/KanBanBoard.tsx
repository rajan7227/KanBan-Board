import { PlusIcon } from "../icons/Plusicon";
import { useState } from "react";
import { Column, Id, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";

function KanBanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  console.log(columns);
  return (
    <div className="m-auto flex min-h-screen w-full items-center  overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto flex gap-4">
        <div className="flex  gap-4 ">
          {columns.map((col) => (
            <ColumnContainer  key={col.id} column={col} deleteColumn={() => deleteColumn(col.id)} />
          ))}
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

  function deleteColumn(id){
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns)
  }
}

export default KanBanBoard;
