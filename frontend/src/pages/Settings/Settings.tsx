import "./Settings.scss";
import { useState, useEffect, useRef } from "react";
import { AuthLogs } from "@/components/AuthMidleware/AuthLogs";
import { useTasks } from "@/context/TasksContext";
import { SideBar } from "@/components/SideBar/SideBar";
import { HeaderBar } from "@/components/HeaderBar/HeaderBar";
import { Link, useLocation } from "react-router-dom";
import { addStorage, getStorage, removeStorage } from "@/Utils/utilsStorage";
import { useAuth } from "@/context/AuthContext";
import { createFileCalendarConfig } from "@/samples/node-api";

export const SettingsPage = () => {
  const location = useLocation();
  const page = location.pathname.split("/")[2];
  const [settingsCategory, setSettingsCategory] = useState("");
  const [notification, setNotification] = useState("Zoom changed");

  useEffect(() => {
    if (page === "account") {
      setSettingsCategory("Account");
    }
    if (page === "calendar") {
      setSettingsCategory("Calendar");
    }
    if (page === "notifications") {
      setSettingsCategory("Notifications");
    }
    if (page === "security") {
      setSettingsCategory("Security");
    }
    if (page === "" || page === undefined || page === " " || page === null) {
      setSettingsCategory("Account");
    }
    if (
      page !== "account" &&
      page !== "calendar" &&
      page !== "notifications" &&
      page !== "security"
    ) {
      setSettingsCategory("Account");
    }
  }, [page]);

  AuthLogs();

  const { user } = useAuth();

  const { getUrlIcal, urlIcal } = useTasks();

  const inputUrlIcal = useRef<HTMLInputElement>(null);

  const handleSubmitUrlIcal = (e: any) => {
    e.preventDefault();
    const url = e.target.urlIcal.value;
    if (url.trim() === "") {
      return;
    }
    addStorage("urlIcal", url);
    getUrlIcal();
  };

  const handleRemoveUrlIcal = (e: any) => {
    removeStorage("urlIcal");
    getUrlIcal();
    inputUrlIcal.current!.value = "";
  };

  const [currentZoomCalendar, setCurrentZoomCalendar] = useState(
    getStorage("zoomCalendar") !== null &&
      getStorage("zoomCalendar") !== undefined &&
      getStorage("zoomCalendar") !== ""
      ? getStorage("zoomCalendar")
      : 85
  );
  const [currentHstartCalendar, setCurrentHstartCalendar] = useState(
    getStorage("hstartCalendar") !== null &&
      getStorage("hstartCalendar") !== undefined &&
      getStorage("hstartCalendar") !== ""
      ? getStorage("hstartCalendar")
      : 0
  );
  const [currentHendCalendar, setCurrentHendCalendar] = useState(
    getStorage("hendCalendar") !== null &&
      getStorage("hendCalendar") !== undefined &&
      getStorage("hendCalendar") !== ""
      ? getStorage("hendCalendar")
      : 24
  );

  const zoomCalendar = (e: any) => {
    const zoom = e.target.value;
    addStorage("zoomCalendar", zoom);
    setCurrentZoomCalendar(zoom);
    setNotification("Zoom changed");
  };

  const hstartCalendar = (e: any) => {
    const hstart = e.target.value;
    addStorage("hstartCalendar", hstart);
    setCurrentHstartCalendar(hstart);
  };

  const hendCalendar = (e: any) => {
    const hend = e.target.value;
    addStorage("hendCalendar", hend);
    setCurrentHendCalendar(hend);
  };

  const exportCalendarSettings = async () => {
    const zoom =
      getStorage("zoomCalendar") !== null &&
      getStorage("zoomCalendar") !== undefined &&
      getStorage("zoomCalendar") !== ""
        ? getStorage("zoomCalendar")
        : 85;
    const hstart =
      getStorage("hstartCalendar") !== null &&
      getStorage("hstartCalendar") !== undefined &&
      getStorage("hstartCalendar") !== ""
        ? getStorage("hstartCalendar")
        : 0;
    const hend =
      getStorage("hendCalendar") !== null &&
      getStorage("hendCalendar") !== undefined &&
      getStorage("hendCalendar") !== ""
        ? getStorage("hendCalendar")
        : 24;
    const urlIcal =
      getStorage("urlIcal") !== null &&
      getStorage("urlIcal") !== undefined &&
      getStorage("urlIcal") !== ""
        ? getStorage("urlIcal")
        : "";
    const data = `zoom:${zoom},hstart:${hstart},hend:${hend},urlIcal:${urlIcal}`;

    const path = await createFileCalendarConfig(data);
    const link = document.createElement("a");
    link.href = path;
    link.download = "calendarConfig.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCalendarSettings = () => {
    const input = document.querySelector(
      "#importCalendarConfig"
    ) as HTMLInputElement;
    const file = input.files![0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const data = reader.result;
      const dataSplit = data?.toString().split(",");
      const zoom = dataSplit![0].split(":")[1];
      const hstart = dataSplit![1].split(":")[1];
      const hend = dataSplit![2].split(":")[1];
      let urlIcal = dataSplit![3].split(":")[2];
      urlIcal = "https:" + urlIcal;
      urlIcal = urlIcal.slice(0, -2);
      addStorage("zoomCalendar", zoom);
      addStorage("hstartCalendar", hstart);
      addStorage("hendCalendar", hend);
      addStorage("urlIcal", urlIcal);
      setCurrentZoomCalendar(zoom);
      setCurrentHstartCalendar(hstart);
      setCurrentHendCalendar(hend);
      const inputZoom = document.querySelector("#zoom") as HTMLInputElement;
      const inputHstart = document.querySelector("#hstart") as HTMLInputElement;
      const inputHend = document.querySelector("#hend") as HTMLInputElement;
      const inputUrlIcal = document.querySelector(
        "#urlIcal"
      ) as HTMLInputElement;
      inputZoom.value = zoom;
      inputHstart.value = hstart;
      inputHend.value = hend;
      inputUrlIcal.value = urlIcal;
      getUrlIcal();
    };
    input.value = "";
  };

  return (
    <div className="view__dashboard">
      <SideBar />
      <div className="view__dashboard__content">
        <HeaderBar />
        <nav className="settings__nav">
          <ul>
            <li>
              <Link
                to="/settings/account"
                className={settingsCategory === "Account" ? "active" : ""}
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/settings/calendar"
                className={settingsCategory === "Calendar" ? "active" : ""}
              >
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/settings/notifications"
                className={settingsCategory === "Notifications" ? "active" : ""}
              >
                Notifications
              </Link>
            </li>
            <li>
              <Link
                to="/settings/security"
                className={settingsCategory === "Security" ? "active" : ""}
              >
                Security
              </Link>
            </li>
          </ul>
        </nav>
        <div className="InterneNotifications">
          <p>
            <span className="InterneNotifications__title">{notification}</span>
          </p>
        </div>
        {settingsCategory === "Account" && (
          <div className="settings__container">
            {/* <h2>Account</h2> */}
            <p>Change your account settings and profile details.</p>
            <div className="settings__container__content">
              <div className="settings__container__content__left">
                {/* <h3>Profile</h3> */}
                <ul>
                  <li>
                    <div className="form-group">
                      <label htmlFor="firstname">First Name</label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        defaultValue={user?.user_firstname}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <label htmlFor="lastname">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        defaultValue={user?.user_lastname}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="fakeInput">{user?.user_email}</div>
                    </div>
                  </li>
                  <li>
                    <div className="form-group form-group-row">
                      <label>
                        Version :
                        <p className="version">
                          {user?.user_pro === 0 && "Free"}
                          {user?.user_pro === 1 && "Premium"}
                        </p>
                      </label>
                      <button className="btn-change">Edit Infos</button>
                    </div>
                  </li>
                </ul>
              </div>
              {/* <div className="settings__container__content__right">
                <img
                  src={user?.user_picture_profile}
                  alt="avatar"
                  draggable={false}
                />
              </div> */}
            </div>
          </div>
        )}
        {settingsCategory === "Calendar" && (
          <div className="settings__container">
            {/* <h2>Calendar</h2> */}
            <p>Change your calendar settings and profile details.</p>
            <div className="settings__container__content">
              <div className="settings__container__content__left">
                <ul>
                  <li>
                    <form action="" onSubmit={handleSubmitUrlIcal}>
                      <div className="form-group">
                        <label htmlFor="urlIcal">Change url ical</label>
                        <input
                          type="text"
                          name="urlIcal"
                          id="urlIcal"
                          defaultValue={
                            urlIcal !== undefined &&
                            urlIcal !== null &&
                            urlIcal !== ""
                              ? urlIcal
                              : ""
                          }
                          ref={inputUrlIcal}
                        />
                      </div>
                      <div className="form-group-row">
                        <button
                          type="button"
                          onClick={handleRemoveUrlIcal}
                          className="btn-calendar"
                        >
                          Supprimer
                        </button>
                        <button className="btn-change" type="submit">
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </li>
                  <li>
                    <div className="form-group">
                      <label htmlFor="zoom">
                        Change zoom <span>{`(${currentZoomCalendar}%)`}</span>
                      </label>
                      <div className="form-group-row">
                        <input
                          type="range"
                          name="zoom"
                          id="zoom"
                          min={70}
                          max={150}
                          step={5}
                          onChange={zoomCalendar}
                          defaultValue={
                            getStorage("zoomCalendar") !== null &&
                            getStorage("zoomCalendar") !== undefined &&
                            getStorage("zoomCalendar") !== ""
                              ? getStorage("zoomCalendar")
                              : (85 as any)
                          }
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <label htmlFor="hstart">
                        Change hour start{" "}
                        <span>{`(${currentHstartCalendar}H)`}</span>
                      </label>
                      <div className="form-group-row">
                        <input
                          type="range"
                          name="hstart"
                          id="hstart"
                          min={0}
                          max={8}
                          step={1}
                          onChange={hstartCalendar}
                          defaultValue={
                            getStorage("hstartCalendar") !== null &&
                            getStorage("hstartCalendar") !== undefined &&
                            getStorage("hstartCalendar") !== ""
                              ? getStorage("hstartCalendar")
                              : (0 as any)
                          }
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <label htmlFor="hend">
                        Change hour end{" "}
                        <span>{`(${currentHendCalendar}H)`}</span>
                      </label>
                      <div className="form-group-row">
                        <input
                          type="range"
                          name="hend"
                          id="hend"
                          min={16}
                          max={23}
                          step={1}
                          onChange={hendCalendar}
                          defaultValue={
                            getStorage("hendCalendar") !== null &&
                            getStorage("hendCalendar") !== undefined &&
                            getStorage("hendCalendar") !== ""
                              ? getStorage("hendCalendar")
                              : (23 as any)
                          }
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <button
                      className="btn-export"
                      type="button"
                      onClick={exportCalendarSettings}
                    >
                      Export calendar settings
                    </button>
                  </li>
                  <li>
                    <div className="importcalendar-group">
                      <label htmlFor="importCalendarConfig">
                        Import calendar settings
                      </label>
                      <input
                        type="file"
                        name="importCalendarConfig"
                        id="importCalendarConfig"
                        onChange={importCalendarSettings}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {settingsCategory === "Notifications" && (
          <div className="settings__container">
            <h2>Notifications</h2>
            <p>Change your notifications settings and profile details.</p>
            <div className="settings__container__content">
              <div className="settings__container__content__left">
                <h3>Notifications</h3>
                <ul>
                  <li>
                    <span>Notifications</span>
                    <span>test</span>
                  </li>
                  <li>
                    <span>Notifications</span>
                    <span>test</span>
                  </li>
                  <li>
                    <span>Notifications</span>
                    <span>test</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {settingsCategory === "Security" && (
          <div className="settings__container">
            {/* <h2>Security</h2> */}
            <p>Change your security settings.</p>
            <div className="settings__container__content">
              <div className="settings__container__content__left">
                <form>
                  <ul>
                    <li>
                      <div className="form-group">
                        <label htmlFor="oldpassword">Old Password</label>
                        <input
                          type="password"
                          name="oldpassword"
                          id="oldpassword"
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <label htmlFor="newpassword">New Password</label>
                        <input
                          type="password"
                          name="newpassword"
                          id="newpassword"
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form-group-row">
                        <button className="btn-password" type="submit">
                          Logout
                        </button>
                      </div>
                    </li>
                  </ul>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
