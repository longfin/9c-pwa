import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { KeystoreAccount, isKeystoreJson } from 'ethers';
import AccountLoader from './accountLoader';
import { atom, useRecoilState } from 'recoil';
import { Button } from '@mui/material';
import keystoreAccount from '@/atoms/keystoreAccount';
import { set } from 'idb-keyval';

export default function Home() {
  const [account, _] = useRecoilState(keystoreAccount);
  const handleImportKeystoreFile = async () => {
    const fh:[FileSystemFileHandle] = await window.showOpenFilePicker({
        startIn: "documents",
        multiple: false,
    });
    const keystoreFile = await fh[0].getFile();
    const content = await keystoreFile.text();
    if (isKeystoreJson(content)) {
        await set(keystoreFile.name, content);
    }
  }
  
  return (
    <>
      <main className={styles.main}>
        { account === undefined 
          ? <AccountLoader /> 
          : <Button component={Link} href="lobby">Start with {account.address}!</Button>}
        <Button onClick={handleImportKeystoreFile}>Import keystore via file</Button>
        <Button component={Link} href="qrImport">Import keystore via QR</Button>
      </main>
    </>
  )
}
