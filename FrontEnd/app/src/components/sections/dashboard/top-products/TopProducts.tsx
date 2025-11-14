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
import { productTableRows } from 'data/product-data';
import ProductItemRow from './ProductItemRow';

const TopProducts = (): ReactElement => {
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
            {productTableRows.map((product) => (
              <ProductItemRow key={product.id} productItem={product} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

export default TopProducts;
