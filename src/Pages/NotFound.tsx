import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className={styles.homeLink}>Go back home</Link>
    </div>
  );
};

export default NotFound;
