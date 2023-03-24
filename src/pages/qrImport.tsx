import { isKeystoreJson } from "ethers";
import { set } from "idb-keyval";
import { useRouter } from 'next/router';
import { QrScanner } from "@yudiel/react-qr-scanner";

export default function QRImport() {
    const router = useRouter();
    const handleScan = async (result: string) => {
        if (isKeystoreJson(result)) {
            await set("qr", result);
            alert("Imported.");
            router.push("/");
        }
    }
    const handleError = (err: Error) => {
        console.error(err);
    }

    return <QrScanner
          onDecode={handleScan}
          onError={handleError}
          constraints={{width: 1280, height: 720, facingMode: {ideal: "environment"}}}
        />
}