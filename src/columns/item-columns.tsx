import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid-premium";
import type {Item} from "~src/columns/TBShopSimple";
import React, {useState} from "react";
import {Box, Fade, Modal} from "@mui/material";

export const dateValueFormatter = (value: string) => {
  return new Date(value).toLocaleString("zh-CN")
};

export const linkRender = (params: GridRenderCellParams<any, string>) => {
  return <a href={`${params.value?.trim()}`} target="_blank">{`${params.value?.trim()}`}</a>
};

export const imageRender = (params: GridRenderCellParams<any, string>) => {
  return <Box
    sx={{display: 'flex', height: '100%', direction: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <ImagePreview src={params.value.trim()}/>
  </Box>
};

const ImagePreview = ({src, alt}: { src: string, alt?: string }) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  };

  const defaultAlt = alt ? alt : 'image';

  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100vh"}}>
      {!open &&
        <img style={{maxWidth: 56, maxHeight: 56}} onClick={() => setOpen(true)} src={`${src}_q80.jpg_.webp`}
             alt={`${defaultAlt}`}/>}
      <Modal
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open} timeout={500}>
          <img style={{maxWidth: '80%', maxHeight: '80%'}} src={`${src}_q80.jpg_.webp`} alt={`${defaultAlt}`}/>
        </Fade>
      </Modal>
    </Box>
  )
}

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
    field: 'cateId',
    headerName: '类目',
    width: 120,
    editable: true,
  },
  {
    field: 'createdAt',
    headerName: '更新时间',
    width: 150,
    editable: true,
    valueFormatter: dateValueFormatter
  },
];