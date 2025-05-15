import styles from "./Spin.module.css";

export const Spin = ({ size, ...attr }) => {
  return <div className={size !== "large" ? styles.spin : styles.largeSpin} {...attr}></div>
}