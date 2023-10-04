import React, { Suspense } from "react";
import "./Auth.scss";
import { AuthApp } from "@/components/AuthMidleware/AuthApp";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { DynamiqueHome } from "@/components/DynamiqueHome/DynamiqueHome";

export const LoginPage = () => {
  AuthApp();
  const { login } = useAuth();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { email, password, remember } = e.target.elements;
    if (remember.checked) {
      login(email.value, password.value, 30);
    } else {
      login(email.value, password.value, 24);
    }
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
          <h1>WELCOME BACK</h1>
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <div className="auth__form__remember__container">
            <div className="auth__form__remember">
              <input type="checkbox" name="remember" id="remember" />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>
            <Link to="/forgot-password" target="_blank" className="forgot__btn">
              Forgot Password?
            </Link>
          </div>
          <button type="submit">Login</button>
          <Link className="register__login" to="/register">
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};
