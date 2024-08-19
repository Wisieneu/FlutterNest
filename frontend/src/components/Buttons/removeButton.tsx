import { MdDeleteForever } from "react-icons/md";

export default function RemoveButton() {
  return (
    <div className="cursor-pointer rounded-full border border-appBgColor bg-slate-300 p-2 text-gray-500 hover:rotate-12 hover:bg-red-600 hover:text-gray-700">
      <MdDeleteForever size={20} />
    </div>
  );
}
