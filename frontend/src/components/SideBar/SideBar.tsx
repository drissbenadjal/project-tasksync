import "./SideBar.scss";
import { Link, useLocation } from "react-router-dom";
import IconCalendar from "@/assets/icons/icon-calendar.svg";
import IconTask from "@/assets/icons/icon-task.svg";
import IconPro from "@/assets/icons/icon-pro.svg";
import IconSetting from "@/assets/icons/icon-setting.svg";

export const SideBar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link
            to="/home"
            className={location.pathname === "/home" ? "active" : ""}
          >
            <span>
              <img src={IconTask} alt="My Tasks" />
            </span>
            My Tasks
          </Link>
        </li>
        <li>
          <Link
            to="/calendar"
            className={location.pathname === "/calendar" ? "active" : ""}
          >
            <span>
              <img src={IconCalendar} alt="Calendar" />
            </span>
            Calendar
          </Link>
        </li>
        <li>
          <Link
            to="/premium"
            className={location.pathname === "/premium" ? "active" : ""}
          >
            <span>
              <img src={IconPro} alt="Go to pro" />
            </span>
            Go To Pro
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link
            to="/settings"
            className={location.pathname === "/settings" ? "active" : ""}
          >
            <span>
              <img src={IconSetting} alt="Settings" />
            </span>
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};
