import { MouseEventHandler } from "react";

type SubmitBtnProps = {
  type: "submit" | "reset" | "button" | undefined;
  text: string;
  disabled: boolean;
  onClickHandler: MouseEventHandler<HTMLButtonElement>;
};

export default function SubmitBtn({
  type,
  text,
  disabled,
  onClickHandler,
}: SubmitBtnProps) {
  return (
    <button
      className={`rounded-3xl border border-purple-950 px-4 py-2 font-bold text-white ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-purple-950"}`}
      onClick={onClickHandler}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
