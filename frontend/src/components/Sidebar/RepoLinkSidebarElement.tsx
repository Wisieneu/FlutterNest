import { FaBug, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RepoLinkSidebarElement() {
  return (
    <div className="rounded-md p-2">
      <div className="flex justify-between p-2 text-purple-900">
        <FaBug />
        <FaLightbulb />
        <FaBug />
        <FaLightbulb />
      </div>
      <div className="text-sm">
        Are you encountering any bugs? Would you like to request a new feature?{" "}
        <br />
        Please submit any tickets to our{" "}
        <Link
          to="https://github.com/Wisieneu/FlutterNest/issues"
          target="_blank"
        >
          <span className="repo-link">GitHub repository</span>
        </Link>
      </div>
    </div>
  );
}
