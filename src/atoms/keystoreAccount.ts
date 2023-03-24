import { KeystoreAccount } from "ethers";
import { atom } from "recoil";

export default atom<KeystoreAccount>({
    key: "keystoreAccount",
    default: undefined,
})