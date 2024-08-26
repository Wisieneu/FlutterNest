import { IoMdCloseCircle } from "react-icons/io";

export default function CloseButton() {
  return (
    <div className="cursor-pointer rounded-full border border-appBgColor bg-slate-300 p-2 text-gray-500 hover:rotate-12 hover:bg-red-600 hover:text-gray-700">
      <IoMdCloseCircle size={30} />
    </div>
  );
}
