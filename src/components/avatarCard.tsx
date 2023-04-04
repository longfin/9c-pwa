import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { BencodexDictionary, Key, Value, encode } from "@planetarium/bencodex";
import { Account, Address, Signature } from "@planetarium/account";
import { UnsignedTxWithCustomActions, encodeUnsignedTxWithCustomActions } from "@planetarium/tx";
import { useRecoilState } from "recoil";
import { parse, v4 as uuidv4 } from "uuid";
import keystoreAccountAtom from "../atoms/account";
import txNonceAtom from "../atoms/txNonce";

const genesisHash = Uint8Array.from(Buffer.from("4582250d0da33b06779a8475d283d5dd210c683b9b999d74d03fac4f58fa6bce", "hex"));

export interface IAvatar
{
    name: string,
    actionPoint: number,
    level: number,
    address: string,
}

const SIGNATURE_KEY = new Uint8Array([0x53]); // 'S';
const signTx = async (tx: UnsignedTxWithCustomActions, signAccount: Account) => {
    const payload = encodeUnsignedTxWithCustomActions(tx);
    const signature = await signAccount.sign(encode(payload));
    return {
      ...tx,
      signature,
    };
}

const encodeSignedTx = (signedTx: UnsignedTxWithCustomActions & {signature: Signature}) => {
    const sig = signedTx.signature.toBytes();
    const dict = encodeUnsignedTxWithCustomActions(signedTx);
    return new BencodexDictionary([
        ...dict,
        [SIGNATURE_KEY, sig],
    ]);
}

export default function AvatarCard({ avatar }: {avatar: IAvatar}) {
    const [account, _] = useRecoilState(keystoreAccountAtom);
    const [txNonce, __] = useRecoilState(txNonceAtom);
    
    const handleChargeAP = async () => {
        if (avatar.actionPoint !== 0 && !confirm("AP will be charged to only 120, would you proceed?")) {
            return;
        }

        if (!txNonce) {
            alert("Can't send transaction since next txNonce wasn't fetched properly.");
            return;
        }

        const action = new Map<Key, Value>([
            ["type_id", "daily_reward6"],
            [
                "values",
                new Map<Key, Value>([
                    ["id", parse(uuidv4())],
                    ["a", Address.fromHex(avatar.address).toBytes()],
                ])
            ],
        ]);
        const unsignedTx = {
            nonce: BigInt(txNonce),
            publicKey: account.publicKey.toBytes("uncompressed"),
            signer: Address.deriveFrom(account).toBytes(),
            timestamp: new Date(),
            updatedAddresses: new Set([]),
            genesisHash,
            customActions: [action],
        };
        const signedTx = await signTx(unsignedTx, account);

        if (navigator.serviceWorker?.controller) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log(event);
            }, {
                once: true,
            });
            navigator.serviceWorker.controller.postMessage({
                command: "stageTx",
                payload: Buffer.from(encode(encodeSignedTx(signedTx))).toString("hex"),
            });
        }
    }
    
    return <Card>
        <CardContent>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Typography>Name</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{avatar.name}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>Level</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{avatar.level}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>AP</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography>{avatar.actionPoint} / 120</Typography>
                    <Button onClick={handleChargeAP}>Charge AP</Button>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}