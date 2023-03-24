import keystoreAccountAtom from "../atoms/keystoreAccount";
import AccountCard from "../components/accountCard";
import { graphql } from "../gql";
import { useRecoilState } from "recoil";
import { useQuery } from "urql";

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

export default function Lobby()
{
    const [keystoreAccount, _] = useRecoilState(keystoreAccountAtom);
    const [accountInfoResult, __] = useQuery({
        query: AccountInfoQueryDocument,
        variables: { address: keystoreAccount?.address },
        pause: !keystoreAccount,
    });
    const account = accountInfoResult?.data;
    
    return (account) 
        ? <AccountCard account={account} />
        : <>You need to unlock keystore first.</>
}