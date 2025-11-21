import { ReactElement, useState, useEffect } from 'react';
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

const ProductManagement = (): ReactElement => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        stock: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            setProducts(response.data);
            setError(null);
        } catch (err: any) {
            setError('Error al cargar productos: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
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
            setLoading(true);
            await productService.createProduct(formData);
            setSuccess('Producto agregado exitosamente');
            setFormData({
                name: '',
                description: '',
                price: 0,
                imageUrl: '',
                category: '',
                stock: 0,
            });
            fetchProducts();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError('Error al agregar producto: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            setLoading(true);
            await productService.deleteProduct(id);
            setSuccess('Producto eliminado exitosamente');
            fetchProducts();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError('Error al eliminar producto: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
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
                                name="name"
                                value={formData.name}
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
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
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
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{product.name}</TableCell>
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
