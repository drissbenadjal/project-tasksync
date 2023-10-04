import { AuthLogs } from "@/components/AuthMidleware/AuthLogs";
import { SideBar } from "@/components/SideBar/SideBar";
import { HeaderBar } from "@/components/HeaderBar/HeaderBar";
import { TaskMenu } from "@/components/TaskMenu/TaskMenu";
import { MyTasks } from "@/components/MyTasks/MyTasks";
import './Home.scss'

export const HomePage = () => {
    AuthLogs();
    return (
        <div className="view__dashboard">
            <SideBar />
            <div className="view__dashboard__content">
                <HeaderBar />
                <TaskMenu />
                <MyTasks />
            </div>
        </div>
    )
}