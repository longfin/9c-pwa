import { atom } from "recoil";
import { Account } from "@planetarium/account";

export default atom<Account>({
    key: "account",
    default: undefined,
})