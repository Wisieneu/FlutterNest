export interface ProgressBarIndicatorProps {
  textContent: string;
  isVisible: boolean;
  colorClass: string;
  progress: number;
}

export default function ProgressBarIndicator(props: ProgressBarIndicatorProps) {
  return (
    <div
      className={`${props.isVisible ? "" : "hidden"} relative mr-6 inline-block h-[27px] w-20 self-center rounded-full border`}
      style={{ borderColor: props.colorClass }}
    >
      <div
        className={`h-full rounded-full`}
        style={{
          width: `${props.textContent.length > 44 ? props.progress : 35}%`,
          backgroundColor: props.colorClass,
        }}
      ></div>
      <span className={`absolute top-1 w-full text-center font-mono text-sm`}>
        {props.textContent.length > 1 ? 128 - props.textContent.length : ""}
      </span>
    </div>
  );
}
