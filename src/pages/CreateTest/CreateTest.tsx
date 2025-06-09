import { Link } from "react-router-dom";
import styles from "./CreateTest.module.css";
import { useState } from "react";
import Back from "../CreateTest/back.png";
import { dataService } from "../../services/DataService";
import { errorToast, successToast } from "../../services/Toast";
import Spinner from "../../components/Spinner/Spinner";

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState("");
  const [audiofile, setAudiofile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isButtonDisabled = !text || !answers || !title;

  const createTest = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("answers", answers);
    formData.append("audiofile", audiofile as File);
    formData.append("type", "input-choice");

    setIsLoading(true);
    const response = await dataService.createTest(formData);
    setIsLoading(false);

    if (response?.success) {
      setTitle("");
      setText("");
      setAnswers("");
      setAudiofile(null);

      successToast("Test created successfully");
    } else {
      errorToast("Failed to create test");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton}>
        <Link className={styles.containerBtnBack} to="/">
          <img className={styles.imgBack} src={Back} alt="Go back" />
          Go Back{" "}
        </Link>
      </button>
      <div className={styles.content}>
        <h2 className={styles.title}>Create New Test</h2>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="text">Text (use ___ for blanks)</label>
        <textarea
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <label htmlFor="odpowiedzi">Odpowiedzi (oddzielone przecinkami)</label>
        <input
          id="odpowiedzi"
          type="text"
          placeholder="mają, chce, kosztuje"
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
        />
        <label htmlFor="file">Audio File</label>
        <input
          id="file"
          type="file"
          accept="audio/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            setAudiofile(file as File);
          }}
        />
        <button
          className={styles.button}
          onClick={createTest}
          disabled={isButtonDisabled}
          style={{
            backgroundColor: isButtonDisabled ? "grey" : "#0f1729",
          }}
        >
          Stwórz test
        </button>
      </div>
    </div>
  );
}
