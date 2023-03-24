import { isKeystoreJson } from "ethers";
import { set } from "idb-keyval";
import { useRouter } from 'next/router';
import QrReader from "react-qr-scanner";

export default function QRImport() {
    const router = useRouter();
    const handleScan = async (data) => {
        if (isKeystoreJson(data?.text)) {
            await set("qr", data?.text);
            alert("Imported.");
            router.reload();
        }
    }
    const handleError = (err) => {
        console.error(err);
    }
    return <QrReader
          style={{width: 640, height: 640}}
          onScan={handleScan}
          onError={handleError}
          resolution={1080}
          constraints={{audio: false, video: {width: 1280, height: 720, focusMode: "continuous", facingMode: {ideal: "environment"}}}}
        />
}