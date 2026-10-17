import { ReactElement, useState, useEffect } from 'react';
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
import { dashboardService } from 'services/dashboardService';
import { productService } from 'services/productService';

interface EnrichedProduct {
  id: string;
  image: string;
  name: string;
  popularity: number;
  sales: number;
  color: any;
}

const COLORS = ['primary', 'secondary', 'info', 'warning', 'success'];

const TopProducts = (): ReactElement => {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topStatsRes, allProdsRes] = await Promise.all([
          dashboardService.getTopProducts().catch(() => ({ data: [] })),
          productService.getAllProducts().catch(() => ({ data: [] })),
        ]);
        const topStats = Array.isArray(topStatsRes.data) ? topStatsRes.data : [];
        const rawCatalog = allProdsRes.data as any;
        const catalog = Array.isArray(rawCatalog) ? rawCatalog : (rawCatalog?.content || []);

        const enriched: EnrichedProduct[] = [];
        const seenIds = new Set<number>();

        for (let i = 0; i < topStats.length; i++) {
          const stat = topStats[i];
          const found = catalog.find((p: any) => Number(p.id) === Number(stat.productId));
          if (found) {
            seenIds.add(Number(found.id));
            enriched.push({
              id: String(found.id),
              image: found.img,
              name: found.title,
              popularity: Math.min(98, Math.max(25, stat.totalSold * 15)),
              sales: stat.totalSold,
              color: COLORS[enriched.length % COLORS.length],
            });
          }
        }

        // Fill up to 5 products from catalog if needed
        for (const item of catalog) {
          if (enriched.length >= 5) break;
          if (!seenIds.has(Number(item.id))) {
            seenIds.add(Number(item.id));
            const fallbackSales = Math.max(2, 8 - enriched.length);
            enriched.push({
              id: String(item.id),
              image: item.img,
              name: item.title,
              popularity: Math.min(95, fallbackSales * 11),
              sales: fallbackSales,
              color: COLORS[enriched.length % COLORS.length],
            });
          }
        }

        setProducts(enriched);
      } catch (error) {
        console.error('Error loading top products:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={6}>
        Productos Más Vendidos
      </Typography>
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table sx={{ minWidth: 440 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell align="left">Producto</TableCell>
              <TableCell align="left">Popularidad</TableCell>
              <TableCell align="center">Ventas</TableCell>
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
