import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Navbar({hunLink, engLink, rollHelper, manageWeapons, rollHelperLink, manageWeaponsLink}) {
  return (
    <nav className={styles.navbar}>
      <span className={styles.navbarItem1}>
        <Link href={rollHelperLink}>{rollHelper}</Link>
      </span>
      <span className={styles.navbarItem2}>
              <Link href={manageWeaponsLink}>{ manageWeapons}</Link>
          </span>
          <button className={styles.langSelectButton1}><Link href={hunLink}>HUN</Link></button>
          <button className={styles.langSelectButton2}><Link href={engLink}>ENG</Link></button>
    </nav>
  );
}