import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <span className={styles.navbarItem1}>
        <Link href="/">Dobássegítő</Link>
      </span>
      <span className={styles.navbarItem2}>
        <Link href="/manageWeapons">Fegyverek kezelése</Link>
      </span>
    </nav>
  );
}
