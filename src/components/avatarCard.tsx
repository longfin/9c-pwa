import { Card, CardContent, Grid, Typography } from "@mui/material";

export interface IAvatar
{
    name: string,
    actionPoint: number,
    level: number,
}

export default function AvatarCard({ avatar }: {avatar: IAvatar}) {
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
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}