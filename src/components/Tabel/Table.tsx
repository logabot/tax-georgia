import React from 'react';
import {
	keyframes,
	Paper,
	Table as TableMui,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useAppSelector, useFilteredRows } from "../../box/hooks";
import { CustomTableRow } from "./CustomTableRow/CustomTableRow";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

export const highlightAnimation = (theme: Theme) => keyframes`
  0% {
    background-color: ${theme.palette.error.main};
  }
  100% {
    background-color: inherit;
  }
`;

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
	'&:last-child td': {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		fontWeight: 700
	},
	'&.animate': {
		animation: `${highlightAnimation(theme)} 2s ease`,
	},
}));

export interface IHandleUpdateRow {
	payload: { name: string, value: any };
}

export interface ITableProps {
	year: number;
}

const Table: React.FC<ITableProps> = ({ year }) => {
	const rows = useAppSelector(state => state.tablesReducer.rows);

	const filteredRows = useFilteredRows(rows, year);

	const totalAmountConverted = filteredRows.reduce((sum, item) => sum + item.amountConverted, 0);
	const totalTaxConverted = filteredRows.reduce((sum, item) => sum + item.taxConverted, 0);

	if (!filteredRows?.length) return null;

	return (
		<TableContainer component={Paper} sx={{ mb: 2 }}>
			<TableMui sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<StyledTableCell align="left">Дата</StyledTableCell>
						<StyledTableCell align="center">Валюта</StyledTableCell>
						<StyledTableCell align="center">Сумма</StyledTableCell>
						<StyledTableCell align="center">Налог (%)</StyledTableCell>
						<StyledTableCell align="right">Курс</StyledTableCell>
						<StyledTableCell align="right">Сумма (GEL)</StyledTableCell>
						<StyledTableCell align="right">Налог (GEL)</StyledTableCell>
						<StyledTableCell align="right">Доход на дату</StyledTableCell>
						<StyledTableCell align="right" />
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredRows?.map((row) => (
						<CustomTableRow key={row?.id} row={row} year={year} />
					))}
					<StyledTableRow>
						<StyledTableCell align="left" colSpan={5}>Итого за {year} год:</StyledTableCell>
						<StyledTableCell align="right">
							<CopyToClipboard text={totalAmountConverted.toFixed(2)}>
								{totalAmountConverted.toFixed(2)}
							</CopyToClipboard>
						</StyledTableCell>
						<StyledTableCell align="right">
							<CopyToClipboard text={totalTaxConverted.toFixed(2)}>
								{totalTaxConverted.toFixed(2)}
							</CopyToClipboard>
						</StyledTableCell>
						<StyledTableCell align="right" />
						<StyledTableCell align="right" />
					</StyledTableRow>
				</TableBody>
			</TableMui>
		</TableContainer>
	);
};

export default Table;