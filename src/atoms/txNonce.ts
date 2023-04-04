import { atom } from "recoil";

export default atom<number | null>({
    key: "txNonce",
    default: null,
});