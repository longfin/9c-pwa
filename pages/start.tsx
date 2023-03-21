import { keys as getKeys, get  } from "idb-keyval";
import { useEffect, useState } from "react";
import { KeystoreAccount, decryptKeystoreJson } from "ethers";

export default function Start() {
    const [keys, setKeys] = useState<string[]>([]);
    const [acc, setAcc] = useState<KeystoreAccount | undefined>(undefined);
    useEffect(() => {
        (async () => {
            setKeys(await getKeys());
        })();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const keystoreName = e.target.keystoreName.value;
        const passphrase = e.target.passphrase.value;
        const keystoreContent = await get(keystoreName);
        const acc = await decryptKeystoreJson(keystoreContent, passphrase);
        setAcc(acc);
    }
    return <>
        <form onSubmit={handleSubmit}>
            <select name="keystoreName">
                {keys.length > 0 && keys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <input type="password" name="passphrase" />
            <button>Start</button>
            { acc && <>Loaded account: {acc.address}</>}
        </form>
    </>
}