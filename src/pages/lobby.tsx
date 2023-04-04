import { useRecoilState } from "recoil";
import { useQuery } from "urql";
import { Address } from "@planetarium/account";
import accountAtom from "../atoms/account";
import AccountCard from "../components/accountCard";
import txNonceAtom from "../atoms/txNonce";
import { graphql } from "../gql";
import { useEffect } from "react";

const AccountInfoQueryDocument = graphql(/* GraphQL */ `
    query accountInformation($address: Address!) {
        txNonce: transaction {
            nextTxNonce(address: $address)
        }
        agentState: stateQuery {
            agent(address: $address) {
                address
                gold
                avatarStates {
                    index
                    name
                    level
                    actionPoint
                    address
                }
            }
        }
    }
`);

export default function Lobby() {
    const [accountState, _] = useRecoilState(accountAtom);
    const [__, setTxNonce] = useRecoilState(txNonceAtom);
    const address = accountState?.publicKey ? Address.deriveFrom(accountState.publicKey).toHex() : undefined;
    const [queryResult, ___] = useQuery({
        query: AccountInfoQueryDocument,
        variables: { address },
        pause: !accountState,
    });
    
    useEffect(() => {
        if (queryResult.data?.txNonce.nextTxNonce) {
            const txNonce = queryResult.data.txNonce.nextTxNonce;
            setTxNonce(_ => txNonce);
        }
    }, [queryResult, setTxNonce]);

    return (!accountState)
        ? <>You need to unlock keystore first.</>
        : 
            (queryResult.data)
            ? <AccountCard account={queryResult.data} />
            : <>Now loading...</>

}