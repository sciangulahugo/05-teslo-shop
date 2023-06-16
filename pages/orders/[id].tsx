import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { OrderSummary } from "@/components/cart";
import CartList from "@/components/cart/CartList";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const { shippingAddress } = order;

	const orderValues = {
		numberOfItems: order.numberOfItems,
		subTotal: order.subTotal,
		tax: order.tax,
		total: order.total,
	};

	return (
		<ShopLayout title="Resumen de la orden" pageDescription="Resumen de la orden" >
			<Typography variant="h1" component="h1">Orden: {order._id}</Typography>

			{
				order.isPaid
					? (
						<Chip
							sx={{ my: 2 }}
							label="Orden ya pagada"
							variant="outlined"
							color="success"
							icon={<CreditScoreOutlined />}
						/>)
					: (
						<Chip
							sx={{ my: 2 }}
							label="Pendiente de pago"
							variant="outlined"
							color="error"
							icon={<CreditCardOffOutlined />}
						/>)
			}

			<Grid container sx={{ mt: 2 }} className="fadeIn">
				<Grid item xs={12} sm={7}>
					<CartList
						products={order.orderItems}
					/>
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">
								Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})
							</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle1">Dirección de entrega</Typography>
							</Box>
							<Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
							<Typography>{shippingAddress.address} {shippingAddress.addressConfirm ? `, ${shippingAddress.addressConfirm}` : ''}</Typography>
							<Typography>{shippingAddress.country}</Typography>
							<Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
							<Typography>{shippingAddress.phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrderSummary orderValues={orderValues} />
							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								{
									order.isPaid
										? (
											<Chip
												sx={{ my: 2 }}
												label="Orden ya pagada"
												variant="outlined"
												color="success"
												icon={<CreditScoreOutlined />}
											/>
										)
										: (
											<h1>Pagar</h1>
										)
								}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout >
	);
};

// Vamos a hacer algunos analisis antes de dar acceso a la persona

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = '' } = query;

	// Traemos la session del usuario
	const session: any = await getSession({ req });
	// console.log({ session });

	// Si no hay session, lo logueamos y lo traemos de vuelta
	if (!session)
		return {
			redirect: {
				destination: `/auth/login?page=/orders/${id}`,
				permanent: false,
			}
		};

	const order = await dbOrders.getOrderById(id.toString());

	if (!order)
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false,
			}
		};

	// Analizamos si la orden es del mismo usuario
	if (order.user !== session.user._id)
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false,
			}
		};


	return {
		props: {
			order
		}
	};
};

export default OrderPage;
