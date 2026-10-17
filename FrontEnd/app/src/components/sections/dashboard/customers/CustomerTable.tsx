/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect, ReactElement } from 'react';
import { Stack, Avatar, Tooltip, Typography, CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridColDef,
  useGridApiRef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import { rows } from 'data/customer-data';
import { stringAvatar } from 'helpers/string-avatar';
import { currencyFormat } from 'helpers/format-functions';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';

const columns: GridColDef<any>[] = [
  {
    field: 'id',
    headerName: 'ID',
    resizable: false,
    minWidth: 60,
  },
  {
    field: 'name',
    headerName: 'Cliente',
    valueGetter: (params: any) => params,
    renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
      <Stack direction="row" gap={1} alignItems="center">
        <Tooltip title={params.row.name} placement="top" arrow>
          <Avatar {...stringAvatar(params.row.name)} />
        </Tooltip>
        <Typography variant="body2">{params.row.name}</Typography>
      </Stack>
    ),
    resizable: false,
    flex: 1,
    minWidth: 155,
  },
  {
    field: 'email',
    headerName: 'Correo',
    resizable: false,
    flex: 0.7,
    minWidth: 160,
  },
  {
    field: 'phone',
    headerName: 'Teléfono',
    resizable: false,
    flex: 0.8,
    minWidth: 130,
  },
  {
    field: 'billing-address',
    headerName: 'Dirección de Envío',
    sortable: false,
    resizable: false,
    flex: 1.2,
    minWidth: 240,
  },
  {
    field: 'total-spent',
    headerName: 'Total Comprado',
    resizable: false,
    sortable: false,
    align: 'right',
    headerAlign: 'right',
    flex: 0.8,
    minWidth: 110,
    valueFormatter: (value) => currencyFormat(Number(value), { minimumFractionDigits: 2 }),
  },
];

const CustomerTable = ({ searchText }: { searchText: string }): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== 'id'),
    [columns],
  );

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word: string) => word !== ''),
    );
  }, [searchText]);

  useEffect(() => {
    const handleResize = () => {
      if (apiRef.current) {
        apiRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [apiRef]);

  return (
    <DataGrid
      apiRef={apiRef}
      density="standard"
      columns={visibleColumns}
      autoHeight={false}
      rowHeight={56}
      disableColumnMenu
      disableRowSelectionOnClick
      rows={rows}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 4 } },
      }}
      slots={{
        loadingOverlay: CircularProgress,
        pagination: CustomPagination,
        noResultsOverlay: CustomNoResultsOverlay,
      }}
      slotProps={{
        pagination: { labelRowsPerPage: rows.length },
      }}
      sx={{
        height: 1,
        width: 1,
        tableLayout: 'fixed',
        scrollbarWidth: 'thin',
      }}
    />
  );
};

export default CustomerTable;
