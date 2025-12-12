import { ReactElement, useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { productService, Product } from 'services/productService';
import { inventoryService } from 'services/inventoryService';

const ProductManagement = (): ReactElement => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fix for memory leak warning
    const isMounted = useRef(true);

    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        title: '',
        description: '',
        price: 0,
        img: '',
        category: '',
        stock: 0,
    });

    useEffect(() => {
        isMounted.current = true;
        fetchProducts();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchProducts = async () => {
        try {
            if (isMounted.current) setLoading(true);
            const response = await productService.getAllProducts();
            if (isMounted.current) {
                setProducts(response.data);
                setError(null);
            }
        } catch (err: any) {
            if (isMounted.current) {
                setError('Error al cargar productos: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isMounted.current) setLoading(true);

            // 1. Create Product
            const response = await productService.createProduct(formData);
            const newProduct = response.data;

            // 2. Create Inventory Record
            if (newProduct.id) {
                await inventoryService.createInventory({
                    productId: newProduct.id,
                    stock: formData.stock || 0,
                    reservedStock: 0
                });
            }

            if (isMounted.current) {
                setSuccess('Producto y stock agregados exitosamente');
                setFormData({
                    title: '',
                    description: '',
                    price: 0,
                    img: '',
                    category: '',
                    stock: 0,
                });
                fetchProducts();
                setTimeout(() => {
                    if (isMounted.current) setSuccess(null);
                }, 3000);
            }
        } catch (err: any) {
            if (isMounted.current) {
                console.error("Error creating product/inventory:", err);
                setError('Error al agregar producto: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            if (isMounted.current) setLoading(true);
            await productService.deleteProduct(id);
            if (isMounted.current) {
                setSuccess('Producto eliminado exitosamente');
                fetchProducts();
                setTimeout(() => {
                    if (isMounted.current) setSuccess(null);
                }, 3000);
            }
        } catch (err: any) {
            if (isMounted.current) {
                setError('Error al eliminar producto: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Productos
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Formulario para agregar producto */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Agregar Nuevo Producto
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <TextField
                                fullWidth
                                label="Precio"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                            <TextField
                                fullWidth
                                label="URL de Imagen"
                                name="img"
                                value={formData.img}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                helperText="Pega una URL o sube una imagen abajo"
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Subir Imagen (Desde PC)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, img: reader.result as string }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </Button>
                            <TextField
                                fullWidth
                                label="Categoría"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleInputChange}
                                margin="normal"
                                inputProps={{ min: 0 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Agregar Producto'}
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Lista de productos */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Productos Existentes
                        </Typography>
                        {loading && products.length === 0 ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Imagen</TableCell>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Precio</TableCell>
                                            <TableCell>Categoría</TableCell>
                                            <TableCell>Stock</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    No hay productos disponibles
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            products.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <img
                                                            src={product.img}
                                                            alt={product.title}
                                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://placehold.co/100?text=No+Image';
                                                                e.currentTarget.onerror = null;
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{product.title}</TableCell>
                                                    <TableCell>${product.price}</TableCell>
                                                    <TableCell>{product.category || '-'}</TableCell>
                                                    <TableCell>{product.stock || 0}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => product.id && handleDelete(product.id)}
                                                            disabled={loading}
                                                        >
                                                            <IconifyIcon icon="mdi:delete" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductManagement;
