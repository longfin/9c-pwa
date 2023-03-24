import { clear } from "idb-keyval";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

export default function Settings() {
    const router = useRouter();
    const handleClearAllKeystore = () => {
        if (confirm("All loaded keystore will be deleted. this operations can't be undone. would you like to proceed?")) {
            clear();
            router.push("/");
        }
    }
    return <>
        <Button onClick={handleClearAllKeystore}>Clear all keystores</Button>
    </>
}