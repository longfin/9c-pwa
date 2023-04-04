import { graphql } from "../gql";
import { cacheExchange, createClient, dedupExchange, fetchExchange } from "urql";

type Command = "stageTx";

const StageTxMutation = graphql(/* GraphQL */ `
    mutation stageTx($payload: String!) {
        stageTransaction(payload: $payload)
    }
`);

const urqlClient = createClient({
    url: "https://9c-main-full-state.planetarium.dev/graphql",
    exchanges: [fetchExchange, dedupExchange, cacheExchange],
});

const stageTx = async (tx: string) => {
    const { data } = await urqlClient.mutation(StageTxMutation, {
        payload: tx
    }).toPromise();
    return data?.stageTransaction;
}

self.addEventListener('message', event => {
    const request: {
        command: Command,
        payload: string,
    } = event.data;

    switch (request.command) {
        case "stageTx":
            stageTx(request.payload).then(txId => event.source?.postMessage(txId));
            break;
    
        default:
            break;
    }
});
  
