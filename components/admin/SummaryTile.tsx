import { FC } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

interface Props {
	title: string | number;
	subTitle: string;
	icon: JSX.Element;
}

// Mosaico de resumen
export const SummaryTile: FC<Props> = ({ title, subTitle, icon }) => {
	return (
		<Grid item xs={12} sm={4} md={3}>
			<Card sx={{ display: "flex", justifyContent: "center" }}>
				<CardContent sx={{
					width: 50,
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}>
					{icon}
				</CardContent>
				<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Typography variant="h3">{title}</Typography>
					<Typography variant="caption">{subTitle}</Typography>
				</CardContent>

			</Card>
		</Grid>
	);
};
