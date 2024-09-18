import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {DataGridPremium, type GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid-premium";
import {zhCN} from "~src/components/zh-CN";
import {columns} from "~src/columns/item-columns";
import {db} from "~src/lib/db";
import type {Item} from "~src/columns/TBShopSimple";
import {newDb} from "~src/lib/newDb";
import {EmailAddress} from "~src/lib/model";

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

function getItemsAndSave(setItems: Dispatch<SetStateAction<Item[]>>) {
  getItems().then(data => {
    setItems(data)
  })
}

export function ItemListTable() {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    getItemsAndSave(setItems);
    newDb.emails.add(new EmailAddress(crypto.randomUUID(), 'dfw', '759965663@qq.com'))
    newDb.emails.toArray().then(emails => {
      console.log(emails)
    })
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