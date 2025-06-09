import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Test.module.css";
import { errorToast, successToast } from "../../services/Toast";
import { dataService } from "../../services/DataService";
import Confetti from "react-confetti";
import { useWindowSize } from "../../hooks/useWindowSize";

type Test = {
  id: number;
  type: string;
  title: string;
  content: {
    text: string;
    answers: string[];
    audiofile: string;
  };
};

const getBorderStyle = (userAnswer: boolean) => {
  return userAnswer ? "1px solid green" : "1px solid red";
};

export default function Test() {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: boolean }>(
    {}
  );

  const { id } = useParams();
  const [test, setTest] = useState<Test | null>(null);
  const [countChecked, setCountChecked] = useState(0);
  const { width, height } = useWindowSize();
  const [isTestSolved, setIsTestSolved] = useState(false);
  const answersArr = Object.values(userAnswers);

  const isButtonDisabled =
    isTestSolved || answersArr.length !== test?.content.answers.length;

  useEffect(() => {
    if (!id) return;

    const getTest = async () => {
      const response = await dataService.getTest(id);

      if (response?.success) {
        setTest(response.data);
      } else {
        errorToast(`Ошибка: ${response?.data?.error}`);
      }
    };
    getTest();
  }, []);

  const renderTest = useMemo(() => {
    if (!test) return null;

    const parts = test.content.text.split("__");
    const elements = [];

    for (let i = 0; i < parts.length; i++) {
      elements.push(
        <span
          key={`text-${i}`}
          style={{ whiteSpace: "pre-wrap", margin: "4px 2px" }}
        >
          {parts[i]}
        </span>
      );
      if (i < parts.length - 1) {
        elements.push(
          <input
            key={`input-${i}`}
            type="text"
            readOnly={isTestSolved}
            style={{
              margin: "4px 2px",
              width: "100px",
              border:
                countChecked > 0
                  ? getBorderStyle(userAnswers[i])
                  : "1px solid black",
            }}
            onChange={(e) => {
              setUserAnswers((prev) => ({
                ...prev,
                [i]: e.target.value.toLowerCase() === test.content.answers[i],
              }));
            }}
          />
        );
      }
    }

    return elements;
  }, [test, countChecked]);

  const renderMistakes = useMemo(() => {
    if (!test || countChecked === 0) return null;

    return test.content.answers.map((answer, i) => {
      const isCorrect = answersArr[i];

      if (isCorrect) return null;

      return (
        <span key={`mistake-${i}`} style={{ margin: "4px 2px", color: "red" }}>
          Odpowiedź {i + 1}: {answer}
        </span>
      );
    });
  }, [countChecked, test]);

  const checkAnswers = () => {
    setCountChecked((prev) => prev + 1);

    if (answersArr.length === test?.content.answers.length) {
      const isCorrect = answersArr.every((answer) => answer);

      if (isCorrect) {
        setIsTestSolved(true);
        successToast("Test zaliczony!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Confetti width={width} height={height} run={isTestSolved} />
      <div className={styles.content}>
        <h2 className={styles.title}>{test?.title}</h2>
        {test?.content.audiofile && (
          <audio src={test.content.audiofile} controls />
        )}
        <div>{renderTest}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {renderMistakes}
        </div>
        <button
          className={styles.button}
          style={{
            backgroundColor: isButtonDisabled ? "#797a7c" : "#0f1729",
          }}
          onClick={checkAnswers}
          disabled={isButtonDisabled}
        >
          sprawdzić
        </button>
      </div>
    </div>
  );
}
