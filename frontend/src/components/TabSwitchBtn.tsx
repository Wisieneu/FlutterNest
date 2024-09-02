import { TabType } from "@/routes/UserDetailPage";

export interface TabSwitchBtnProps {
  tabName: TabType;
  isActive: boolean;
  changeTab: (tabName: TabType) => void;
}

export default function TabSwitchBtn(props: TabSwitchBtnProps) {
  function handleTabChange(event: React.MouseEvent<HTMLLIElement>) {
    if (!props.isActive) props.changeTab(props.tabName);
  }

  return (
    <li
      className={`relative flex w-full items-center justify-center p-4 transition duration-150 ease-in-out ${props.isActive ? "cursor-default" : "cursor-pointer hover:bg-gray-800"}`}
      onClick={handleTabChange}
    >
      <span className="font-bold text-gray-400">{props.tabName}</span>
      {props.isActive && (
        <div className="absolute bottom-0 w-[38%] border-b-[3px] border-appPurple" />
      )}
    </li>
  );
}
