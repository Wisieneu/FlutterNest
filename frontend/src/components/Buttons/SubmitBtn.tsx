import { SizeType } from "@/types";
import { MouseEventHandler } from "react";

type SubmitBtnProps = {
  type: "submit" | "reset" | "button" | undefined;
  text: string;
  disabled: boolean;
  onClickHandler: MouseEventHandler<HTMLButtonElement>;
};

export default function SubmitBtn(props: SubmitBtnProps) {
  return (
    <button
      className={`rounded-3xl border border-purple-950 px-4 py-2 font-bold text-white ${props.disabled ? "cursor-not-allowed opacity-20" : "hover:bg-purple-950"}`}
      onClick={props.onClickHandler}
      type={props.type}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}
