import { entries as getEntries, get, set  } from "idb-keyval";
import { useEffect, useState } from "react";
import { AddressLike, decryptKeystoreJson, isKeystoreJson } from "ethers";
import { useRecoilState } from "recoil";
import { Button, FormControl, FormLabel, Grid, MenuItem, NativeSelect, Select, TextField } from "@mui/material";
import { useRouter } from "next/router";
import keystoreAccount from "@/atoms/keystoreAccount";

export default function AccountLoader() {
    const [keystores, setKeystores] = useState<[string, AddressLike][]>([]);
    const [_, setKeystoreAccount] = useRecoilState(keystoreAccount);
    const router = useRouter();
    useEffect(() => {
        (async () => {
            setKeystores((await getEntries()).map(([k, v]) => [k, JSON.parse(v)["address"]]));
        })();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const keystoreName = e.target.keystoreName.value;
        const passphrase = e.target.passphrase.value;
        const keystoreContent = await get(keystoreName);
        try {
            const keystoreAccount = await decryptKeystoreJson(keystoreContent, passphrase);
            setKeystoreAccount(_ => keystoreAccount);
            router.push("lobby");
        } catch {
            alert("Decryption failed.");
        }
    }
    
    return <>
        {keystores.length > 0 && 
        <form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item>
                    <FormControl fullWidth>
                        <FormLabel>Account</FormLabel>
                        <NativeSelect name="keystoreName" defaultValue={keystores[0][0]}>
                            {keystores.map(([keystoreName, address]) => <option key={keystoreName} value={keystoreName}>{address}</option>)}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <FormLabel>Passphrase</FormLabel>
                        <TextField type="password" name="passphrase" />
                    </FormControl>                    
                </Grid>
                <Button type="submit">Load</Button>
            </Grid>
        </form>
        }
    </>
}