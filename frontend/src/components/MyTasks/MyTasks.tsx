import "./MyTasks.scss";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useTasks } from "@/context/TasksContext";
import IconDots from "@/assets/icons/Meatballs_menu.svg";

export const MyTasks = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const HandleOptions = (uuid: string) => {
    console.log(uuid);
  };

  return (
    <div className="mytasks">
      {tasks.length === 0 && (
        <div className="mytasks__empty">
          <h2>You don't have any tasks yet</h2>
          <p>
            Click on the button below to create your first task and start
            managing your time
          </p>
        </div>
      )}
      {tasks.length > 0 && (
        <ul>
          {tasks.map((task: any) => {
            //mettre la date sous form de 22 sept 2021
            let date = task.task_due_date as string;
            let dateSplit = date.split("T");
            let dateSplit2 = dateSplit[0].split("-");
            // prendre dateSplit2[1] et la convertir en mois
            let month = dateSplit2[1];
            let monthName = "";
            switch (month) {
              case "01":
                monthName = "Jan";
                break;
              case "02":
                monthName = "Fev";
                break;
              case "03":
                monthName = "Mar";
                break;
              case "04":
                monthName = "Avr";
                break;
              case "05":
                monthName = "Mai";
                break;
              case "06":
                monthName = "Jun";
                break;
              case "07":
                monthName = "Jul";
                break;
              case "08":
                monthName = "Aou";
                break;
              case "09":
                monthName = "Sept";
                break;
              case "10":
                monthName = "Oct";
                break;
              case "11":
                monthName = "Nov";
                break;
              case "12":
                monthName = "Dec";
                break;
              default:
                monthName = "Invalid Month";
                break;
            }
            let day = dateSplit2[2];
            let year = dateSplit2[0];
            let dateFinal = day + " " + monthName + " " + year;

            //faire un day left
            let dateNow = new Date();
            let dateNowSplit = dateNow.toISOString().split("T");
            let dateNowSplit2 = dateNowSplit[0].split("-");
            let dateNowFinal =
              dateNowSplit2[0] + dateNowSplit2[1] + dateNowSplit2[2];
            let dateTaskSplit = date.split("T");
            let dateTaskSplit2 = dateTaskSplit[0].split("-");
            let dateTaskFinal =
              dateTaskSplit2[0] + dateTaskSplit2[1] + dateTaskSplit2[2];
            let dayLeft = (dateTaskFinal as any) - (dateNowFinal as any);

            return (
              <li key={task.id}>
                <div className="mytasks__task">
                  <button
                    className="mytasks__task__interaction__btn"
                    onClick={() => HandleOptions(task.task_uuid)}
                  >
                    <img src={IconDots} alt="Options" />
                  </button>

                  <div className="mytasks__task__title">
                    <h3>{task.task_name}</h3>
                  </div>

                  <div className="mytasks__task__date">
                    <p>{dateFinal}</p>
                  </div>

                  <div
                    className="mytasks__task__dayleft"
                    style={{ color: task.task_color }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="13"
                        r="7"
                        stroke={task.task_color}
                        strokeWidth="2"
                      />
                      <path
                        d="M5 5L3 7"
                        stroke={task.task_color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19 5L21 7"
                        stroke={task.task_color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 11L11.8093 12.8729C11.9172 12.9448 12.0622 12.9223 12.1432 12.821L14 10.5"
                        stroke={task.task_color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{dayLeft} days left</span>
                  </div>

                  <div className="mytasks__task__progression">
                    <div className="mytasks__task__progression__bar">
                      <div
                        className="mytasks__task__progression__bar__progress"
                        style={{
                          width: task.task_completed + "%",
                          backgroundColor: task.task_color,
                        }}
                      ></div>
                    </div>
                    <p>{task.task_completed}%</p>
                  </div>

                  <div className="mytasks__task__description">
                    <p>{task.task_description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
