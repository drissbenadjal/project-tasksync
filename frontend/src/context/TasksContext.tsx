import { createContext, useContext, useEffect, useState } from "react";
import { getStorage, addStorage, removeStorage } from "@/Utils/utilsStorage";
import { useAuth } from "./AuthContext";

const TasksContext = createContext({
  tasks: [],
  urlIcal: "",
  getTasks: () => { },
  getUrlIcal: () => { },
});

// Définir la fonction fetchTasksFromServer à l'extérieur du composant
const fetchTasksFromServer = async (token: any) => {
  const response = await fetch("http://localhost:3001/tasksync/api/v1/tasks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des tâches");
  }

  const data = await response.json();
  return data;
};

export const TasksProvider = ({ children }: any) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  const token = getStorage("token");

  const [urlIcal, setUrlIcal] = useState("");
  
  const getUrlIcal = () => {
    if (getStorage("urlIcal") !== null && getStorage("urlIcal") !== undefined && getStorage("urlIcal") !== "") {
      setUrlIcal(getStorage("urlIcal") as string);
    } else {
      setUrlIcal("");
    }
  };

  const getTasks = () => {
    fetchTasksFromServer(token)
      .then((tasks) => {
        console.log(tasks);
        if (tasks.status === 1) {
          setTasks(tasks.tasks);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (user === null || user === undefined) {
      return;
    }

    if (token === null || token === undefined || token === "") {
      return;
    }

    getTasks();

    getUrlIcal();

  }, [user]);

  return (
    <TasksContext.Provider value={{ tasks, getTasks, urlIcal, getUrlIcal }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
