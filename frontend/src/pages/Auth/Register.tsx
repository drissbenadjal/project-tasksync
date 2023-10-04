import React, { Suspense } from "react";
import { AuthApp } from "@/components/AuthMidleware/AuthApp";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import "./Auth.scss";
import { DynamiqueHome } from "@/components/DynamiqueHome/DynamiqueHome";

export const RegisterPage = () => {
  AuthApp();
  const { register } = useAuth();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { user_firstname, user_lastname, user_email, user_password } =
      e.target.elements;
    register(
      user_firstname.value,
      user_lastname.value,
      user_email.value,
      user_password.value
    );
  };

  return (
    <div className="auth">
      <div className="auth__interactive">
        <Suspense fallback={<div>Loading...</div>}>
          <DynamiqueHome />
        </Suspense>
      </div>
      <div className="auth__form">
        <form onSubmit={handleSubmit}>
          <img src="" alt="logo" />
          <h1>WELCOME</h1>
          <input type="text" name="user_firstname" placeholder="First Name" />
          <input type="text" name="user_lastname" placeholder="Last Name" />
          <input type="text" name="user_email" placeholder="Email" />
          <input type="password" name="user_password" placeholder="Password" />
          <button type="submit">Register</button>
          <Link className="register__login" to="/login">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};
