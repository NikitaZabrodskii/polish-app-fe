import { useEffect, useState } from "react";
import styles from "../Login/Login.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dataService } from "../../services/DataService";
import { errorToast, successToast } from "../../services/Toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isDisabled = !username || !password;
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.removeItem("authToken");
    }
  }, []);

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (isDisabled) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    const response = await dataService.login(username, password);

    console.log({ response });

    if (response?.success) {
      localStorage.setItem("authToken", response.data.token);
      successToast("Успешный вход!");
      navigate("/");
    } else {
      errorToast(`Ошибка: ${response?.data?.error}`);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.containerUsername}>
          <label htmlFor="username">Username</label>
          <input
            className={styles.input}
            id="username"
            type="text"
            placeholder="Введите логин"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className={styles.containerPassword}>
          <label htmlFor="password">Password</label>
          <input
            className={styles.input}
            id="password"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className={styles.containerBtn}>
          <button className={styles.button} onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>
      <div className={styles.containerRegister}>
        <span> Вы не зарегистрированы?</span>
        <Link to="/register" className={styles.text}>
          Перейти к регистрации
        </Link>
      </div>
    </div>
  );
}
