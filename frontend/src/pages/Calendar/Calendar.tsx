import { useEffect, useState } from "react";
import { useTasks } from "@/context/TasksContext";
import "./Calendar.scss";
import { AuthLogs } from "@/components/AuthMidleware/AuthLogs";
import { SideBar } from "@/components/SideBar/SideBar";
import { HeaderBar } from "@/components/HeaderBar/HeaderBar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/fr"; // Importez la localisation française si nécessaire
import ical from 'ical.js';
import { addStorage, getStorage, removeStorage } from "@/Utils/utilsStorage";



moment.updateLocale("en", {
  longDateFormat: {
    LTS: "HH:mm:ss", // Heure, minutes, secondes
    LT: "HH:mm", // Heure, minutes
    L: "YYYY-MM-DD", // Format de date
    LL: "MMMM D, YYYY", // Format de date long
    LLL: "MMMM D, YYYY HH:mm", // Format de date long avec heure
    LLLL: "dddd, MMMM D, YYYY HH:mm", // Format complet
  },
});

const localizer = momentLocalizer(moment);

export const CalendarPage = () => {
  AuthLogs();

  const { tasks, urlIcal } = useTasks();

  const [events, setEvents] = useState([]);

  const [importedICalendar, setImportedICalendar] = useState(false);

  const importICalendar = async (url?: string) => {
    try {
      const response = await fetch('http://localhost:3001/ical', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          url: url,
        } as any),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la connexion");
          }
          return response;
        });
      const data = await response.text();
      const jcalData = ical.parse(data);

      const extractedEvents = jcalData[2].map((item: any) => {
        const vevent = item[1];
        const dtstart = vevent[1][3];
        const dtend = vevent[2][3];
        const summary = vevent[3][3];

        return {
          title: summary,
          start: new Date(dtstart),
          end: new Date(dtend),
        };
      });

      setEvents(prevEvents => [...prevEvents, ...extractedEvents] as any);
    } catch (error) {
      console.error('Erreur lors de l\'import du fichier iCalendar', error);
    }
  };

  useEffect(() => {
    if (tasks.length === 0) {
      return;
    }

    const events = tasks.map((task: any) => {
      let dateAdd = task.task_date_add as string;
      let dateAddSplit = dateAdd.split("T");
      let dateAddSplit2 = dateAddSplit[0].split("-");
      let date = task.task_due_date as string;
      let dateSplit = date.split("T");
      let dateSplit2 = dateSplit[0].split("-");
      let month = dateSplit2[1];
      let monthNumber = 0;
      switch (month) {
        case "01":
          monthNumber = 0;
          break;
        case "02":
          monthNumber = 1;
          break;
        case "03":
          monthNumber = 2;
          break;
        case "04":
          monthNumber = 3;
          break;
        case "05":
          monthNumber = 4;
          break;
        case "06":
          monthNumber = 5;
          break;
        case "07":
          monthNumber = 6;
          break;
        case "08":
          monthNumber = 7;
          break;
        case "09":
          monthNumber = 8;
          break;
        case "10":
          monthNumber = 9;
          break;
        case "11":
          monthNumber = 10;
          break;
        case "12":
          monthNumber = 11;
          break;
        default:
          monthNumber = 0;
          break;
      }
      let day = dateSplit2[2] as any;
      let year = dateSplit2[0];

      let hour = dateAddSplit[1].split(":")[0];
      let minute = dateAddSplit[1].split(":")[1];

      let hourFinal = parseInt(hour);
      hourFinal = hourFinal + 1;

      return {
        title: task.task_name,
        year: year,
        month: monthNumber,
        day: day,
        startHour: hour,
        startMinute: minute,
        endHour: hourFinal,
        endMinute: minute,
      };
    });

    const eventsFinal = events.map((event: any) => {
      return {
        title: event.title,
        start: new Date(event.year, event.month, event.day, event.startHour, event.startMinute),
        end: new Date(event.year, event.month, event.day, event.endHour, event.endMinute),
      };
    });

    setEvents(eventsFinal as any);

    if (!importedICalendar && urlIcal !== undefined && urlIcal !== null && urlIcal !== "") {
      importICalendar(urlIcal);
      setImportedICalendar(true); // Marquer comme importé
    }
  }, [tasks, urlIcal, importedICalendar]);


  const [hstartCalendar, setHstartCalendar] = useState(0);
  const [hendCalendar, setHendCalendar] = useState(24);
  const [zoomCalendar, setZoomCalendar] = useState(85);

  useEffect(() => {
    //si getStorage("hstartCalendar") est null, on met 0 sinon on met la valeur
    if (getStorage("hstartCalendar") === null || getStorage("hstartCalendar") === undefined || getStorage("hstartCalendar") === "") {
      setHstartCalendar(0);
    } else {
      setHstartCalendar(parseInt(getStorage("hstartCalendar") as string));
    }

    //si getStorage("hendCalendar") est null, on met 24 sinon on met la valeur
    if (getStorage("hendCalendar") === null || getStorage("hendCalendar") === undefined || getStorage("hendCalendar") === "") {
      setHendCalendar(23);
    } else {
      setHendCalendar(parseInt(getStorage("hendCalendar") as string));
    }

    if (getStorage("zoomCalendar") === null || getStorage("zoomCalendar") === undefined || getStorage("zoomCalendar") === "") {
      setZoomCalendar(85);
    } else {
      setZoomCalendar(getStorage("zoomCalendar") as any);
    }
  }, []);


  return (
    <div className="view__dashboard">
      <SideBar />
      <div className="view__dashboard__content">
        <HeaderBar />
        <div style={{ height: zoomCalendar + "%", width: "100%", paddingBottom: "20px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            views={["day", "week"]}
            defaultView="week"
            step={60}
            //si getStorage("hstartCalendar") est null, on met 0 sinon on met la valeur
            min={new Date(0, 0, 0, hstartCalendar, 0, 0)}
            max={new Date(0, 0, 0, hendCalendar, 0, 0)}
            showMultiDayTimes
            formats={{
              eventTimeRangeFormat: function ({ start, end }, culture, local) {
                return (
                  local?.format(start, "HH:mm", culture) +
                  " - " +
                  local?.format(end, "HH:mm", culture)
                );
              },
              agendaTimeRangeFormat: function ({ start, end }, culture, local) {
                return (
                  local?.format(start, "HH:mm", culture) +
                  " - " +
                  local?.format(end, "HH:mm", culture)
                );
              },
              dayRangeHeaderFormat: function ({ start, end }, culture, local) {
                return (
                  local?.format(start, "MMMM DD, YYYY", culture) +
                  " - " +
                  local?.format(end, "MMMM DD, YYYY", culture)
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
