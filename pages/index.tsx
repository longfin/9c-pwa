import styles from '@/styles/Home.module.css'
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <Link href="fileImport">Import keystore via file</Link>
        <Link href="qrImport">Import keystore via QR</Link>
        <Link href="start">Start</Link>
      </main>
    </>
  )
}
