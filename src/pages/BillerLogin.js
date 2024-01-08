import React, { useRef } from "react";
import styles from "./BillerLogin.module.css";
import loginImg from "../icons/login.png";
import { useAuthenticateMutation } from "../Utils/customMutationHooks";
import notify from "../Feature Components/notify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function BillerLogin() {

  // refs for uncontrolled input for password and biller name inputs
  const nameRef = useRef();
  const passRef = useRef();

// custom mutation hook for authentication of biller

  const { mutate: authMutate, isLoading } = useAuthenticateMutation();

// onclick handler for login
  const handleLogin = () => {

    // input field validation
    if (!nameRef.current.value) {
      notify("err", "Username Required ");
      return;
    }

    if (!passRef.current.value) {
      notify("err", "Password required");
      return;
    }

    const billerDetail = {
      name: nameRef.current.value.trim(),
      password: passRef.current.value.trim(),
    };

    
    authMutate(billerDetail);
  };

  return (
    <div className={styles.loginPage}>
      <header className={styles.configHeader}>
        <div className={styles.configHeaderText}> Martino'z</div>
      </header>
      <main className={styles.configContainer}>
        <div className={styles.imageContainer}>
          <img src={loginImg} alt="login" className={styles.loginLogo} />
        </div>
        <section className={styles.mainLoginContainer}>
          <form className={styles.loginDetail}>
            <div className={styles.loginTitle}>Biller Login</div>
            <div className={styles.inputContainer}>
              <input type="text" placeholder=" " ref={nameRef} />
              <label className={styles.userNameLabel}> User Name</label>
            </div>
            <div className={styles.inputContainer}>
              <input type="password" placeholder=" " ref={passRef} />
              <label className={styles.passwordLabel}> Password</label>
              <FontAwesomeIcon
                className={styles.showPassword}
                icon={faEye}
                onMouseDown={() => (passRef.current.type = "text")}
                onMouseUp={() => (passRef.current.type = "password")}
              />
            </div>
            <button
              className={styles.loginBtn}
              onClick={() => handleLogin()}
              disabled={isLoading}
            >
              Login
            </button>
          </form>
        </section>
      </main>
      <footer className={styles.loginFooter}>footer</footer>
    </div>
  );
}

export default BillerLogin;
