import {useEffect, useState} from "react";
import {DataGridPremium, type GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid-premium";
import {zhCN} from "~src/components/zh-CN";
import {columns} from "~src/columns/item-columns";
import {useLiveQuery} from "dexie-react-hooks/src";
import {db} from "~src/lib/db";
import type {Item} from "~src/columns/TBShopSimple";

async function getItems() {
  const items = await db.item.toArray();
  await Promise.all(items.map(async item => {
    [item.shop] = await Promise.all([
      db.shop.get(item.userId)
    ])
  }))
  return items;
}

function getItemsAndSave(setItems: (value: (((prevState: Item[]) => Item[]) | Item[])) => void) {
  getItems().then(data => {
    setItems(data)
  })
}

export function ItemListTable() {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  const [items, setItems] = useState<Item[]>([])
  const dbItems = useLiveQuery(() => db.item.toArray());

  useEffect(() => {
    getItemsAndSave(setItems);
  }, []);

  return <DataGridPremium
    onRowSelectionModelChange={(newRowSelectionModel) => {
      setRowSelectionModel(newRowSelectionModel)
    }}
    localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
    slots={{toolbar: GridToolbar}}
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
  />

}