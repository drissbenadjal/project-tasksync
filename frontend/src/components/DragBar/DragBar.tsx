import { CLOSE_BTN } from "@/samples/node-api";
import "./DragBar.scss";
import { useAuth } from "@/context/AuthContext";

import minimize from "../../assets/icons/minimize-svg.svg";
import maximize from "../../assets/icons/maximize-svg.svg";
import close from "../../assets/icons/close-svg.svg";

export const DragBar = () => {
  const { user } = useAuth();
  return (
    <nav className={`top-nav ${process.platform === "darwin" && "mac"}`}>
      <div className="logo">
        <h1>
          TaskSync{" "}
          {user && user.user_pro === 1 && (
            <span className="pro-badge">PRO</span>
          )}
          {user && user.user_pro === 0 && (
            <>
              <span className="pro-badge">FREE {" "}
              {/* ({user.user_firstname} {user.user_lastname})*/}
              </span>
            </>
          )}
        </h1>
      </div>
      {process.platform !== "darwin" && (
        <ul>
          <li
            className="minimize-window"
            onClick={() => CLOSE_BTN.window.minimize()}
          >
            <img draggable="false" src={minimize} alt="logo" />
          </li>
          <li
            className="maximize-window"
            onClick={() => CLOSE_BTN.window.maximize()}
          >
            <img draggable="false" src={maximize} alt="logo" />
          </li>
          <li className="close-window" onClick={() => CLOSE_BTN.window.close()}>
            <img draggable="false" src={close} alt="logo" />
          </li>
        </ul>
      )}
    </nav>
  );
};
