import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import Plus from "./Plus.png";
export default function Header() {
  const token = localStorage.getItem("authToken");

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Testy topolski</h2>
        {token && (
          <Link to="/create" className={styles.button}>
            <div className={styles.containerBtn}>
              <img className={styles.img} src={Plus} alt="Plus" />
              <p className={styles.text}>Stwórz test</p>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
