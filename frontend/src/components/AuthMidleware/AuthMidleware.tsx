import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthMidleware = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user !== null && user !== undefined) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [user]);
};