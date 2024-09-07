import { BsThreeDots } from "react-icons/bs";

export interface TripleDotButtonProps {
  size: string;
  onClickFn?: () => any;
}
export default function TripleDotButton(props: TripleDotButtonProps) {
  const onClickFunction = () => {
    if (props.onClickFn !== undefined) {
      props.onClickFn();
    } else {
      return;
    }
  };
  return (
    <BsThreeDots
      size={props.size}
      className="cursor-pointer text-gray-600"
      onClick={onClickFunction}
    />
  );
}
