import Header from "../../components/Header/Header";
import Cart from "../../components/Cart/Cart";
import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";
import Spinner from "../../components/Spinner/Spinner";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTests();
  }, []);

  const getTests = async () => {
    setIsLoading(true);
    const response = await dataService.getTests();
    setIsLoading(false);

    if (response.success) {
      setData(response.data.tests);
    } else {
      errorToast("Failed to get tests");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header />
        <div className={styles.layoutCarts}>
          {isLoading && <Spinner />}
          {data?.map((cart, i) => (
            <Cart
              key={cart.id}
              title={cart.title}
              test={data}
              id={cart.id}
              getTests={getTests}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
