import { isKeystoreJson } from "ethers";
import { set } from "idb-keyval";
import { useRouter } from 'next/router';
import QrReader from "react-qr-scanner";

export default function QRImport() {
    const router = useRouter();
    const handleScan = async (data) => {
        if (isKeystoreJson(data)) {
            await set("qr", data);
            alert("loaded");
            router.push("start");
        }
    }
    const handleError = (err) => {
        console.error(err);
    }
    return <>
        <QrReader
          style={{width: 640, height: 640}}
          onScan={handleScan}
          onError={handleError}
          facingmode="rear"
        />
    </>
}