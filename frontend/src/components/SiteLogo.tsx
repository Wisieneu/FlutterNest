import { FaAudible } from "react-icons/fa";

export default function Logo() {
  return (
    <a href="/">
      <div className="text-foreground mx-auto flex items-center gap-2 py-4 text-2xl font-semibold tracking-tighter">
        <FaAudible />
        FlutterNest
      </div>
    </a>
  );
}
