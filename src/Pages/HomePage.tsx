import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className={styles.container}>
    <header className={styles.header}>
      <h1>Welcome to Data Beautify</h1>
      <p className={styles.subtitle}>
        Your one-stop solution to format and edit JSON & XML data!
      </p>
    </header>
    <main className={styles.main}>
      <div className={styles.cardContainer}>
        <Link to="/json-formatter" className={styles.card}>
          <h2>JSON Formatter</h2>
          <p>Format, validate, and edit your JSON data effortlessly.</p>
        </Link>
        <Link to="/xml-formatter" className={styles.card}>
          <h2>XML Formatter</h2>
          <p>Clean up and beautify your XML files with ease.</p>
        </Link>
      </div>
    </main>
  </div>
);

export default Home;