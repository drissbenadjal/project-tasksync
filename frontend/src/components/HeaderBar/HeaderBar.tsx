import { useState, useRef, useEffect } from "react";
import "./HeaderBar.scss";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import IconSearch from "@/assets/icons/icon-search.svg";
import IconNotification from "@/assets/icons/icon-notification.svg";
import IconProfil from "@/assets/icons/icon-profil.svg";
import IconSetting from "@/assets/icons/icon-setting.svg";
import IconLogout from "@/assets/icons/icon-logout.svg";

export const HeaderBar = () => {
  const { logout, user } = useAuth();
  console.log(user);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (dropdown) {
      dropdownRef.current?.classList.add("active__dropdown");
    } else {
      dropdownRef.current?.classList.remove("active__dropdown");
    }
  }, [dropdown]);
  return (
    <div className="headerbar">
      <div className="headerbar__left">
        <label htmlFor="search">
          <img src={IconSearch} alt="search" />
          <input type="text" placeholder="Search" id="search" />
        </label>
      </div>

      <div className="headerbar__right">
        <div className="headerbar__right__user">
          <div className="headerbar__right__user__notifications">
            <img src={IconNotification} alt="notifications" />
          </div>
          <div className="headerbar__right__user__avatar">
            <img className="avatar__img" src={user?.user_picture_profile} draggable={false} alt="avatar" onClick={() => setDropdown(!dropdown)} />
            <ul
              className="headerbar__right__user__avatar__dropdown"
              ref={dropdownRef}
            >
              <li>
                <Link to="/settings">
                  <img src={IconProfil} alt="" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <img src={IconSetting} alt="" />
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/" onClick={logout}>
                  <img src={IconLogout} alt="" />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
