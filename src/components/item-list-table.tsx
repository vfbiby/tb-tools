import {type Dispatch, type SetStateAction, useEffect, useState, useCallback, type ReactElement} from "react";
import {
  DataGridPremium,
  type GridRowSelectionModel,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton
} from "@mui/x-data-grid-premium";
import {zhCN} from "~src/components/zh-CN";
import {columns} from "~src/columns/item-columns";
import {db} from "~src/lib/db";
import type {Item} from "~src/columns/TBShopSimple";
import {newDb} from "~src/lib/newDb";
import {EmailAddress} from "~src/lib/model";
import {Box, Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {red} from "@mui/material/colors";
import TuneIcon from '@mui/icons-material/Tune';

async function getItems() {
  const items: Item[] = await db.item.toArray();
  await Promise.all(items.map(async item => {
    [item.shop, item.category] = await Promise.all([
      db.shop.get(item.sellerId),
      db.category.get(item.cateId)
    ])
  }))
  return items;
}

function getItemsAndSetState(setItems: Dispatch<SetStateAction<Item[]>>) {
  getItems().then(data => {
    setItems(data)
  })
}

export function CustomToolbar({otherButtons}: { otherButtons: ReactElement }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarFilterButton/>
      <GridToolbarDensitySelector/>
      <GridToolbarExport
        excelOptions={{disableToolbarButton: true}}
      />
      {otherButtons}
    </GridToolbarContainer>
  );
}

export function DeleteButton(props: { onClick?: () => Promise<void>, selectedRows: GridRowSelectionModel }) {
  return <Button
    disabled={props.selectedRows.length === 0}
    onClick={props.onClick}
    startIcon={<DeleteIcon sx={{fontSize: 28, color: red[600]}}/>}>
    删除
  </Button>;
}

export async function deleteRecordsByIdsThroughMessage(table: string, userIds: number[]) {
  const typeDbMap = {
    'ITEM': db.item
  };
  return typeDbMap[table].bulkDelete(userIds)
}

export const handleDelete = async (table: string, selectedRow: GridRowSelectionModel, refresh?: () => void) => {
  const userIds = Array.from(selectedRow).map(value => value as number);
  if (userIds.length <= 0) {
    console.log('0 user ids to delete')
    return
  }
  await deleteRecordsByIdsThroughMessage(table, userIds);
  refresh()
}

export function ItemListTable() {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  const [items, setItems] = useState<Item[]>([])
  const [headerFilterOpen, setHeaderFilterOpen] = useState<boolean>(false)

  useEffect(() => {
    getItemsAndSetState(setItems);
    // newDb.emails.add(new EmailAddress(crypto.randomUUID(), 'dfw', '759965663@qq.com'))
    newDb.emails.toArray().then(emails => {
      console.log(emails)
    })
  }, []);

  const ConstructToolbar = useCallback(() => {
    const tables = 'ITEM';
    const handleOnClick = () => handleDelete(tables, rowSelectionModel, () => getItemsAndSetState(setItems));
    const otherButtons = <Box>
      <DeleteButton onClick={handleOnClick} selectedRows={rowSelectionModel}/>
      <Button onClick={() => setHeaderFilterOpen(!headerFilterOpen)} startIcon={<TuneIcon/>}>表头筛选</Button>
    </Box>;
    return (
      <CustomToolbar otherButtons={otherButtons}/>
    )
  }, [rowSelectionModel, headerFilterOpen]);

  return <DataGridPremium
    onRowSelectionModelChange={(newRowSelectionModel) => {
      setRowSelectionModel(newRowSelectionModel)
    }}
    localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
    slots={{toolbar: ConstructToolbar}}
    slotProps={{toolbar: {excelOptions: {disableToolbarButton: true}}}}
    getRowId={row => row.itemId}
    rows={items}
    initialState={{
      density: 'comfortable',
      // pinnedColumns: {left: ['itemId'], right: ['createdAt']},
      sorting: {
        sortModel: [{
          field: 'createdAt', sort: 'desc'
        }]
      },
      pagination: {
        paginationModel: {pageSize: 20}
      }
    }}
    columns={columns}
    pagination={true}
    pageSizeOptions={[5, 10, 20, 50, 100, 200, 500, {value: 1000, label: '1千'}]}
    checkboxSelection
    disableRowSelectionOnClick
    headerFilters={headerFilterOpen}
  />

}