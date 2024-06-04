import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { SummaryTile } from '@/components/admin';
import { Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {
	// Aca vamos a utilizar swr
	const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
		refreshInterval: 30 * 1000, // 30 segundos
	});

	const [refreshIn, setRefreshIn] = useState(30);

	useEffect(() => {
		const interval = setInterval(() => {
			// console.log("tick");
			// Podemos tomar el valor del refreshIn
			setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
		}, 1000);

		// Para evitar que el interval se siga ejeutando, lo limpiamos
		return () => clearInterval(interval);
	}, []);

	if (!error && !data) {
		return null;
	}

	if (error) {
		console.log(error);
		return <Typography>Error al cargar</Typography>;
	}

	const {
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	} = data!;

	return (
		<AdminLayout
			title="Dashboard"
			subTitle="Estadisticas"
			icon={<DashboardOutlined />}
		>
			<Grid container spacing={2}>
				<SummaryTile
					title={numberOfOrders}
					subTitle="Ordenes Totales"
					icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={paidOrders}
					subTitle="Ordenes Pagadas"
					icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={notPaidOrders}
					subTitle="Ordenes Pendientes"
					icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={numberOfClients}
					subTitle="Clientes"
					icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={numberOfProducts}
					subTitle="Productos"
					icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={productsWithNoInventory}
					subTitle="Sin existencias"
					icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={lowInventory}
					subTitle="Bajo inventario"
					icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
				/>
				<SummaryTile
					title={refreshIn}
					subTitle="Actualización en: "
					icon={<AccessTimeOutlined color="success" sx={{ fontSize: 40 }} />}
				/>
			</Grid>
		</AdminLayout>
	);
};

export default DashboardPage;