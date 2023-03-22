import keystoreAccount from "@/atoms/keystoreAccount";
import { useRecoilState } from "recoil";

export default function Lobby()
{
    const [account, _] = useRecoilState(keystoreAccount);
    return <>
        Address: {account.address}
    </>;
}