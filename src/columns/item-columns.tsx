import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid-premium";
import type {Item} from "~src/columns/TBShopSimple";
import React from "react";
import {Avatar, Box} from "@mui/material";

export const dateValueFormatter = (value: string) => {
  return new Date(value).toLocaleString("zh-CN")
};

export const linkRender = (params: GridRenderCellParams<any, string>) => {
  return <a href={`${params.value?.trim()}`} target="_blank">{`${params.value?.trim()}`}</a>
};

export const imageRender = (params: GridRenderCellParams<any, string>) => {
  return <Box
    sx={{display: 'flex', height: '100%', direction: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <Avatar sx={{height: 56, width: 56}} alt="item image" variant="square"
            src={`${params.value.trim()}_q80.jpg_.webp`}/>
  </Box>
};

export const columns: GridColDef<Item>[] = [
  {
    field: 'itemId', headerName: '商品ID', width: 120,
  },
  {
    field: 'name',
    headerName: '店铺名',
    width: 120,
    editable: true,
  },
  {
    field: 'title',
    headerName: '标题',
    width: 220,
    editable: true,
  },
  {
    field: 'image',
    headerName: '图片',
    width: 110,
    editable: true,
    renderCell: imageRender
  },
  {
    field: 'itemUrl',
    headerName: '商品链接',
    width: 200,
    editable: true,
    renderCell: linkRender
  },
  {
    field: 'discountPrice',
    headerName: '折后价',
    width: 120,
    editable: true,
  },
  {
    field: 'vagueSold365',
    headerName: '总销量',
    width: 120,
    editable: true,
    valueGetter: (value: string) => {
      if (!value) {
        return 0;
      }
      return parseInt(value)
    },
  },
  {
    field: 'createdAt',
    headerName: '更新时间',
    width: 150,
    editable: true,
    valueFormatter: dateValueFormatter
  },
];