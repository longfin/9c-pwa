import { useRecoilState } from "recoil";
import { useQuery } from "urql";
import { Address } from "@planetarium/account";
import accountAtom from "../atoms/account";
import AccountCard from "../components/accountCard";
import { graphql } from "../gql";

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
                }
            }
        }
    }
`);

export default function Lobby() {
    const [accountState, _] = useRecoilState(accountAtom);
    const address = accountState?.publicKey ? Address.deriveFrom(accountState.publicKey).toHex() : undefined;
    const [queryResult, __] = useQuery({
        query: AccountInfoQueryDocument,
        variables: { address },
        pause: !accountState,
    });
    
    return (!accountState)
        ? <>You need to unlock keystore first.</>
        : 
            (queryResult.data)
            ? <AccountCard account={queryResult.data} />
            : <>Now loading...</>

}