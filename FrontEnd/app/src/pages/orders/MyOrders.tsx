import {
    Box,
    Card,
    Chip,
    Container,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Collapse,
    IconButton,
    Grid
} from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService, OrderResponse } from '../../services/orderService';
import IconifyIcon from 'components/base/IconifyIcon';

interface OrderRowProps {
    order: OrderResponse;
}

const OrderRow = ({ order }: OrderRowProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <IconifyIcon icon="mdi:chevron-up" /> : <IconifyIcon icon="mdi:chevron-down" />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {order.id}
                </TableCell>
                <TableCell align="right">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell align="right">
                    <Chip
                        label={order.status}
                        color={order.status === 'COMPLETED' ? 'success' : 'warning'}
                        variant="outlined"
                    />
                </TableCell>
                <TableCell align="right">
                    {/* Timestamp processing if available */}
                    {new Date().toLocaleDateString()}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Items
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price ($)</TableCell>
                                        <TableCell align="right">Total ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Since OrderResponse currently doesn't strictly define items in the simple interface, 
                      we assume backend returns them or we need to update interface. 
                      For now, using placeholder or checking if backend DTO includes them.
                      Reviewing OrderDto.java, it DOES include List<OrderItemDto> items.
                      We need to update frontend interface to match. */}
                                    {/* Assuming items are available in the response even if TS interface was minimal.
                       I will update TS interface in next step if needed. */}
                                    {(order as any).items?.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell component="th" scope="row">
                                                {item.productTitle}
                                            </TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{item.price}</TableCell>
                                            <TableCell align="right">
                                                {(item.quantity * item.price).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const MyOrders = (): ReactElement => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchOrders(user.id);
        }
    }, [user]);

    const fetchOrders = async (userId: number) => {
        try {
            const response = await orderService.getOrdersByUser(userId);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : orders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">You haven't placed any orders yet.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Order ID</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default MyOrders;
