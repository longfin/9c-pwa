import { entries as getEntries, get  } from "idb-keyval";
import React, { useEffect, useState } from "react";
import { AddressLike, decryptKeystoreJson } from "ethers";
import { useRecoilState } from "recoil";
import { Button, FormControl, FormLabel, Grid, NativeSelect, TextField } from "@mui/material";
import { useRouter } from "next/router";
import accountAtom from "../atoms/account";
import { RawPrivateKey } from "@planetarium/account";

export default function AccountLoader() {
    const [keystores, setKeystores] = useState<[string, AddressLike][]>([]);
    const [_, setAccount] = useRecoilState(accountAtom);
    const router = useRouter();
    useEffect(() => {
        (async () => {
            setKeystores((await getEntries()).map(([k, v]) => [k.toString(), JSON.parse(v)["address"]]));
        })();
    }, []);
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const form = e.target as typeof e.target & {
            keystoreName: { value: string },
            passphrase: { value: string },
        }
        const keystoreContent = await get(form.keystoreName.value);
        try {
            const keystoreAccount = await decryptKeystoreJson(keystoreContent, form.passphrase.value);
            setAccount(_ => RawPrivateKey.fromHex(keystoreAccount.privateKey.replace("0x", "")));
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
                            {keystores.map(([keystoreName, address]) => <option key={keystoreName} value={keystoreName}>{address.toString()}</option>)}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <FormLabel>Passphrase</FormLabel>
                        <TextField type="password" name="passphrase" />
                    </FormControl>                    
                </Grid>
                <Button type="submit">Unlock</Button>
            </Grid>
        </form>
        }
    </>
}