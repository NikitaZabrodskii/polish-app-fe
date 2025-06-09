import RecycleBin from "./RecycleBin.png";
import { Link } from "react-router-dom";
import styles from "./Cart.module.css";
import { dataService } from "../../services/DataService";
import { errorToast, successToast } from "../../services/Toast";
import Spinner from "../Spinner/Spinner";
import { useState } from "react";

export default function Cart({ title, id, test, getTests }) {
  const token = localStorage.getItem("authToken");
  const [isLoading, setIsLoading] = useState(false);

  async function deleteTest() {
    setIsLoading(true);
    const response = await dataService.deleteTest(id);
    setIsLoading(false);

    if (response.success) {
      successToast("Тест успешно удален");
      getTests();
    } else {
      errorToast(`Ошибка: ${result.error}`);
    }
  }

  return (
    <div className={styles.border}>
      <div className={styles.containerText}>
        <p className={styles.title}>{title}</p>
        {token &&
          (isLoading ? (
            <Spinner />
          ) : (
            <img
              className={styles.img}
              src={RecycleBin}
              alt="RecycleBin"
              onClick={deleteTest}
            />
          ))}
      </div>
      <div className={styles.containerBtn}>
        <Link className={styles.button} to={`/test/${id}`} state={{ test }}>
          Podejmij test
        </Link>
      </div>
    </div>
  );
}
