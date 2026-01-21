import { useEffect } from "react";
import styles from "./Alert.module.scss";

type AlertProps = {
  message: string;
  duration?: number; // ms
  onClose: () => void;
};

const Alert = ({ message, duration = 3000, onClose }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className={styles.alert}>{message}</div>;
};

export default Alert;
