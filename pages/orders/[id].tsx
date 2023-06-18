import { useState } from 'react';
// import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { OrderSummary } from "@/components/cart";
import CartList from "@/components/cart/CartList";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { tesloApi } from '@/api';
import { useRouter } from 'next/router';

export type OrderResponseBody = {
	id: string;
	status:
	| "CREATED"
	| "SAVED"
	| "APPROVED"
	| "VOIDED"
	| "COMPLETED"
	| "PAYER_ACTION_REQUIRED";
};

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const router = useRouter();
	const { shippingAddress } = order;

	// Loader
	const [isPaying, setIsPaying] = useState(false);

	// Orden pagada
	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== 'COMPLETED') {
			return alert('Error al pagar');
		}

		// Activamos nuestro loader
		setIsPaying(true);

		try {
			const { data } = await tesloApi.post('/orders/pay', {
				orderId: order._id,
				transactionId: details.id
			});

			return router.reload();
		} catch (error) {
			setIsPaying(false);
			console.log(error);
			alert('Error');
		}
	};

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
								<Box
									display="flex"
									justifyContent="center"
									alignItems="center"
									className="fadeIn"
									sx={{ display: isPaying ? 'flex' : 'none' }}
								>
									<CircularProgress />
								</Box>
								<Box flexDirection="column" sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
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
												<PayPalButtons
													createOrder={(data, actions) => {
														return actions.order.create({
															purchase_units: [
																{
																	amount: {
																		value: `${order.total}`,
																	},
																},
															],
														});
													}}
													onApprove={(data, actions) => {
														return actions.order!.capture().then((details) => {
															onOrderCompleted(details);
															// console.log({ details });
															// const name = details.payer.name!.given_name;
															// alert(`Transaction completed by ${name}`);
														});
													}}
												/>
											)
									}
								</Box>
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
