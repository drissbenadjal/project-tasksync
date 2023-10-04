import "./Loader.scss";
import { useAuth } from "../../context/AuthContext";

export const Loader = () => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="loader">
        <div className="spinner-loader"></div>
      </div>
    );
  } else {
    return null;
  }
};
