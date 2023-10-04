import { useState, useRef, useEffect } from "react";
import { getStorage, addStorage, removeStorage } from "@/Utils/utilsStorage";
import { useTasks } from "@/context/TasksContext";
import "./TaskMenu.scss";
import IconMore from "@/assets/icons/icon-more.svg";
import IconForm1 from "@/assets/icons/icon-form1.svg";
import IconForm2 from "@/assets/icons/icon-form2.svg";

export const TaskMenu = () => {
  const token = getStorage("token");
  const { getTasks } = useTasks();
  const [addTasksModal, setAddTasksModal] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (addTasksModal) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dd = tomorrow.getDate();
      const mm = tomorrow.getMonth() + 1;
      const yyyy = tomorrow.getFullYear();
      const formattedDate = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);

      dateRef.current!.value = formattedDate;
      dateRef.current!.min = formattedDate;

      //si on clique sur le modal, on ferme le modal a part si on clique sur le formulaire
      modalRef.current!.addEventListener("click", (e) => {
        if (e.target !== modalRef.current) {
          return;
        }
        setAddTasksModal(false);
      });

      //si on clique sur le formulaire, on ne ferme pas le modal
      const form = document.querySelector("form");
      form!.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }, [addTasksModal]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const tasks_name = e.target.tasks_name.value;
    const tasks_description = e.target.tasks_description.value;
    const tasks_date = e.target.tasks_date.value;

    if (
      tasks_name.trim() === "" ||
      tasks_description.trim() === "" ||
      tasks_date.trim() === ""
    ) {
      return;
    }

    const date = new Date(tasks_date);
    date.setDate(date.getDate() + 1);
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    let formattedDate = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
    //rajouter l'heure actuelle a la date
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    formattedDate += ` ${hours}:${minutes}:00.000`;

    const tasks_color = e.target.tasks_color.value;

    fetch("http://localhost:3001/tasksync/api/v1/tasks/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        task_name: tasks_name,
        task_description: tasks_description,
        task_due_date: formattedDate,
        task_color: tasks_color,
      } as any),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la création de la tâche");
      }

      getTasks();
      console.log(tasks_name, tasks_description, tasks_date);
      e.target.reset();
      setAddTasksModal(false);
    });
  };

  return (
    <div className="taskmenu">
      <div className="taskmenu_container">
        <div className="taskmenu_left">
          <button>
            Show: <span>All</span>
          </button>
        </div>

        <div className="taskmenu_right">
          <ul>
            <li>
              <button onClick={() => setAddTasksModal(!addTasksModal)}>
                <img src={IconMore} alt="" />
              </button>
            </li>
            <li>
              <button>
                <img src={IconForm1} alt="" />
              </button>
            </li>
            <li>
              <button>
                <img src={IconForm2} alt="" />
              </button>
            </li>
          </ul>
        </div>
      </div>
      {addTasksModal && (
        <>
          <div className="taskmenu_modal" ref={modalRef}>
            <div className="taskmenu_modal__container">
              <form onSubmit={handleSubmit}>
                <div className="form_group">
                  <label htmlFor="tasks_name">Titre</label>
                  <input type="text" name="tasks_name" id="tasks_name" />
                </div>
                <div className="form_group">
                  <label htmlFor="tasks_description">Description</label>
                  <input
                    type="text"
                    name="tasks_description"
                    id="tasks_description"
                  />
                </div>
                <div className="form_group">
                  <label htmlFor="tasks_color">Task Color</label>
                  <select name="tasks_color" id="tasks_color">
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="pink">Pink</option>
                  </select>
                </div>
                <div className="form_group">
                  <label htmlFor="tasks_date">Date</label>
                  <input
                    type="date"
                    name="tasks_date"
                    id="tasks_date"
                    ref={dateRef}
                  />
                </div>
                <button type="submit">ADD TASK</button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
