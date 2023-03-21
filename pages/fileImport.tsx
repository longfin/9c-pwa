import { isKeystoreJson } from "ethers";
import { set } from "idb-keyval";

export default function FileImport() {
    const openFilePicker = async () => {
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
    return <>
        <button onClick={openFilePicker}>Import keystore using file picker</button>
    </>;
}