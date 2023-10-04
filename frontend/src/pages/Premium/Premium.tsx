import "./Premium.scss";
import { AuthLogs } from "@/components/AuthMidleware/AuthLogs";
import { SideBar } from "@/components/SideBar/SideBar";
import { HeaderBar } from "@/components/HeaderBar/HeaderBar";

export const PremiumPage = () => {
  AuthLogs();
  return (
    <div className="view__dashboard">
      <SideBar />
      <div className="view__dashboard__content">
        <HeaderBar />
      </div>
    </div>
  );
};
