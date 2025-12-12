import { ReactElement } from 'react';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from '@mui/material';
import ProductItemRow from './ProductItemRow';
import { useState, useEffect } from 'react';
import { dashboardService, TopProductStat } from 'services/dashboardService';
import { productService, Product } from 'services/productService';

interface EnrichedProduct {
  id: string; // Changed to string to match ProductItem
  image: string;
  name: string;
  popularity: number; // mapped from totalSold
  sales: number; // mapped from totalSold (percentage or similar?) let's just use sales count
  color: any; // Relaxed type to avoid strict union issues for now
}

const TopProducts = (): ReactElement => {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topStatsResponse = await dashboardService.getTopProducts();
        const topStats = topStatsResponse.data;

        // Fetch details for each product
        const enrichedProducts = await Promise.all(
          topStats.map(async (stat) => {
            try {
              const productResponse = await productService.getProductById(stat.productId);
              const product = productResponse.data;
              return {
                id: stat.productId.toString(), // Convert to string
                image: product.img,
                name: product.title,
                popularity: Math.min(100, stat.totalSold * 10),
                sales: stat.totalSold,
                color: 'primary',
              };
            } catch (err) {
              console.error(`Failed to load product ${stat.productId}`, err);
              // Fallback if product not found
              return {
                id: stat.productId.toString(),
                image: '',
                name: `Product ${stat.productId}`,
                popularity: 0,
                sales: stat.totalSold,
                color: 'error',
              };
            }
          })
        );
        setProducts(enrichedProducts);
      } catch (error) {
        console.error('Error loading top products:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={6}>
        Top Products
      </Typography>
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table sx={{ minWidth: 440 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Popularity</TableCell>
              <TableCell align="center">Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <ProductItemRow key={product.id} productItem={product} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

export default TopProducts;
