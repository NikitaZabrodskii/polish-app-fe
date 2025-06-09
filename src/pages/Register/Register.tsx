import styles from "../Register/Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { dataService } from "../../services/DataService";
import { errorToast, successToast } from "../../services/Toast";
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isDisabled = !username || !password;

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (isDisabled) {
      errorToast("Пожалуйста, заполните все поля");
      return;
    }

    const response = await dataService.register(username, password);

    if (response?.success) {
      successToast("Регистрация успешна! Теперь вы можете войти.");
      navigate("/login");
    } else {
      errorToast(`Ошибка: ${response?.data.error}`);
    }
  }

  return (
    <div className={styles.container}>
      {" "}
      <div className={styles.containerContent}>
        <div className={styles.containerUsername}>
          <label htmlFor="username">Username</label>
          <input
            className={styles.input}
            id="username"
            type="text"
            value={username}
            placeholder="Введите логин"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.containerPassword}>
          <label htmlFor="password">Password</label>
          <input
            className={styles.input}
            id="password"
            type="password"
            value={password}
            placeholder="Введите пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.containerBtn}>
          <button className={styles.button} onClick={handleRegister}>
            Регистрация
          </button>
        </div>
      </div>
      <div className={styles.containerRegister}>
        <span> Вы уже зарегистрированы?</span>
        <Link to="/login" className={styles.text}>
          Войти
        </Link>
      </div>
    </div>
  );
}
