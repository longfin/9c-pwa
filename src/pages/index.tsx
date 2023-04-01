import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { isKeystoreJson } from 'ethers';
import AccountLoader from '../components/accountLoader';
import { useRecoilState } from 'recoil';
import { Button } from '@mui/material';
import keystoreAccount from '../atoms/account';
import { set } from 'idb-keyval';
import { useRouter } from 'next/router';

const supportFileSystem = typeof window !== "undefined" && !!window.showOpenFilePicker;

export default function Home() {
  const router = useRouter();
  const [account, _] = useRecoilState(keystoreAccount);
  const handleImportKeystoreFile = async () => {
      if (!supportFileSystem) {
        alert("This browser doesn't support FileSystem API.");
        return;
      }
      
      try {
        const fh:[FileSystemFileHandle] = await window.showOpenFilePicker({
            multiple: false,
        });
        const keystoreFile = await fh[0].getFile();
        const content = await keystoreFile.text();
        if (isKeystoreJson(content)) {
            await set(keystoreFile.name, content);
            alert("Imported.");
            router.reload();
        }
      } catch (err) {
        if (err instanceof DOMException && err.code == DOMException.ABORT_ERR) {
          // aborted by user, ignore.
        } else {
          throw err;
        }
      }
  }
  
  return (
    <>
      <main className={styles.main}>
        { account === undefined && <AccountLoader /> }
        <Button onClick={handleImportKeystoreFile}>Import keystore via file</Button>
        <Button component={Link} href="qrImport">Import keystore via QR</Button>
        <Button component={Link} href="settings">Settings</Button>
      </main>
    </>
  )
}
