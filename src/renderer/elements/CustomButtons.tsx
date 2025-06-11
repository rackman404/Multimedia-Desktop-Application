import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { grey, purple } from '@mui/material/colors';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Chip, TableRow } from '@mui/material';

interface ILinkButton {
    to: string
    component: typeof Link;
}

interface IChip {
    onClick: any;
}


export const LinkButton = styled(Button)<ILinkButton>(({ theme }) => ({
  color: theme.palette.getContrastText(grey[100]),
  backgroundColor: grey[700],
  '&:hover': {
    backgroundColor: grey[800],
  },
}));

export const RegularButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[800]),
  backgroundColor: grey[700],
  '&:hover': {
    backgroundColor: grey[800],
  },
}));

export const TableHeaderRow = styled(TableRow)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: grey[700],

}));
