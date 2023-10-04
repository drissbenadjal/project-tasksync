import { createContext, useContext, useState, useEffect } from "react";
import { getStorage, addStorage, removeStorage } from "@/Utils/utilsStorage";

interface User {
  user_pro: number;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_uuid: string;
  user_picture_profile: string;
}

const AuthContext = createContext({
  loading: true,
  setLoading: (loading: boolean) => {},
  user: null as User | null,
  login: (email: string, password: string, expirationToken: number) => {},
  register: (
    user_firstname: string,
    user_lastname: string,
    user_email: string,
    user_password: string
  ) => {},
  logout: () => {},
});

// Créer un fournisseur pour le contexte
export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
    removeStorage("token");
  };

  useEffect(() => {
    const token = getStorage("token");
    if (token) {
      fetch("http://localhost:3001/tasksync/api/v1/user/verifytoken", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la connexion");
          }

          return response.json();
        })
        .then((data) => {
          setUser(data.user);
        })
        .catch((error) => {
          logout();
          console.error(error);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  const login = (email: string, password: string, expirationToken: number) => {
    fetch("http://localhost:3001/tasksync/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        user_email: email,
        user_password: password,
        expirationToken: expirationToken,
      } as any),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la connexion");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data.user);
        addStorage("token", data.token);
      });
  };

  const register = (
    user_firstname: string,
    user_lastname: string,
    user_email: string,
    user_password: string
  ) => {
    fetch("http://localhost:3001/tasksync/api/v1/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        user_firstname: user_firstname,
        user_lastname: user_lastname,
        user_email: user_email,
        user_password: user_password,
      } as any),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la connexion");
        }
        return response.json();
      })
      .then((data) => {
        // setUser(data.user);
        // addStorage("token", data.token);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <AuthContext.Provider value={{ loading, setLoading, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Utiliser un hook personnalisé pour accéder au contexte
export const useAuth = () => {
  return useContext(AuthContext);
};
