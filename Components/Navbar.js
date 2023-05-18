import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <span className={styles.navbarItem1}>
        <Link href="/">Roll helper</Link>
      </span>
      <span className={styles.navbarItem2}>
        <Link href="/manageWeapons">Manage weapons</Link>
      </span>
    </nav>
  );
}
