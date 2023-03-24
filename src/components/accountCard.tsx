import { Card, CardContent, Grid, Typography } from "@mui/material";
import { AccountInformationQuery } from "../gql/graphql";
import AvatarCard from "./avatarCard";

export default function AccountCard({ account }:  { account: AccountInformationQuery}) {
    const avatarCards = account.agentState.agent?.avatarStates?.map(s => 
        <AvatarCard key={s.index} avatar={s} />
    );
    return <Card>
        <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Typography>Address</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography>{account.agentState.agent?.address}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography>NCG Balance</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography>{account.agentState.agent?.gold}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography>Avatars</Typography>
                </Grid>
                <Grid item xs={10}>
                    {avatarCards}
                </Grid>
            </Grid>
        </CardContent>
    </Card>;
}