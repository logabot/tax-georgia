import React, { FC, useCallback, useEffect, useRef } from 'react';
import TableDatePicker from "../TableDatePicker/TableDatePicker";
import { FormControl, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { CURRENCIES } from "../../../box/constants";
import { IHandleUpdateRow, StyledTableCell, StyledTableRow } from '../Table';
import { IRow, maybeFetchExchangeRate, setUpdateChangedDate, setUpdateRow } from "../../../store/tables-reducers";
import { useAppDispatch, useAppSelector } from "../../../box/hooks";
import { DeleteRow } from '../DeleteRow/DeleteRow';
import { TaxRate } from "../TaxRate/TaxRate";
import { AmountYearlyConverted } from "../AmountYearlyConverted/AmountYearlyConverted";
import CopyToClipboard from "../../CopyToClipboard/CopyToClipboard";

interface ITableRow {
	row: IRow;
	year: number;
}

const calculateConvertedAmounts = (row: IRow, name: keyof IRow, value: any) => {
	if (name === "taxRate") return {
		amountConverted: row?.amountConverted,
		taxConverted: (row.amount * row?.exchangeRate) * (value / 100),
		taxRate: value || 1
	};

	if (name !== "amount") return {
		amountConverted: row?.amountConverted,
		taxConverted: row?.taxConverted,
		taxRate: row?.taxRate
	};

	const amount = Number(value);

	return {
		amountConverted: amount * row?.exchangeRate,
		taxConverted: (amount * row?.exchangeRate) * (row?.taxRate / 100),
		taxRate: row?.taxRate
	};
};

export const CustomTableRow: FC<ITableRow> = ({ row, year }) => {
	const dispatch = useAppDispatch();
	const changedDate = useAppSelector(state => state.tablesReducer.changedDate);
	const rowRef = useRef<HTMLTableRowElement>(null);

	// Handle updating row values
	const handleUpdateField = useCallback(({ payload }: IHandleUpdateRow) => {
		const { name, value } = payload;

		const current = row[name as keyof IRow];
		const isSameDate = name === 'date' && typeof current === 'string' && typeof value === 'string'
			? current.split('T')[0] === value.split('T')[0]
			: current === value;

		if (isSameDate) return;

		const { amountConverted, taxConverted } = calculateConvertedAmounts(row, name as keyof IRow, value);

		const updatedRow = {
			...row,
			[name as keyof IRow]: value,
			amountConverted,
			taxConverted,
		};

		dispatch(setUpdateRow(updatedRow));

		if (["date"].includes(name)) {
			dispatch(setUpdateChangedDate(row.id));
		}

		if (["currency", "date"].includes(name)) {
			dispatch(maybeFetchExchangeRate(updatedRow));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, row.id]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (changedDate) {
			timeoutId = setTimeout(() => {
				dispatch(setUpdateChangedDate(""));
			}, 2000);
		}

		return () => clearTimeout(timeoutId);
	}, [changedDate, dispatch]);

	useEffect(() => {
		if (rowRef.current && changedDate === row?.id) {

			window.scrollTo({
				behavior: 'smooth',
				top: rowRef.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 250,
			});
		}
	}, [changedDate, row?.id]);

	// Handle amount changes directly
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		if (value >= 1) {
			handleUpdateField({ payload: { name: "amount", value } });
		}
	};

	// Handle amount changes directly
	const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		if (value >= 1) {
			handleUpdateField({ payload: { name: "taxRate", value } });
		}
	};

	// Handle currency selection changes directly (using SelectChangeEvent type)
	const handleCurrencyChange = (e: SelectChangeEvent<string>) => {
		handleUpdateField({ payload: { name: "currency", value: e.target.value } });
	};

	return (
		<StyledTableRow
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			className={row.id === changedDate ? 'animate' : ''}
			ref={rowRef}
		>
			<StyledTableCell align="left">
				<TableDatePicker
					row={row}
					value={row.date}
					name="date"
					onChange={handleUpdateField}
				/>
			</StyledTableCell>

			<StyledTableCell align="center">
				<FormControl variant="outlined" fullWidth>
					<Select
						labelId={`${row.currency}-label`}
						id={row.currency}
						name={row.currency}
						value={row.currency}
						onChange={handleCurrencyChange}
					>
						{CURRENCIES?.map((currency) => (
							<MenuItem key={currency} value={currency}>
								{currency}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</StyledTableCell>

			<StyledTableCell align="center">
				<TextField
					value={row?.amount}
					name="amount"
					type="number"
					fullWidth
					sx={{ maxWidth: 110 }}
					onChange={handleAmountChange}
				/>
			</StyledTableCell>

			<StyledTableCell align="center">
				<TextField
					value={row?.taxRate}
					name="taxRate"
					type="number"
					fullWidth
					sx={{ maxWidth: 70 }}
					onChange={handleTaxRateChange}
				/>
			</StyledTableCell>

			<StyledTableCell align="right" sx={{ minWidth: 100 }}>
				<CopyToClipboard text={row?.exchangeRate?.toString()}>
					<TaxRate row={row} />
				</CopyToClipboard>
			</StyledTableCell>

			<StyledTableCell align="right">
				<CopyToClipboard text={row?.amountConverted?.toFixed(2)}>
					{row?.amountConverted?.toFixed(2)}
				</CopyToClipboard>
			</StyledTableCell>
			<StyledTableCell align="right">
				<CopyToClipboard text={row?.taxConverted?.toFixed(2)}>
					{row?.taxConverted?.toFixed(2)}
				</CopyToClipboard>
			</StyledTableCell>
			<StyledTableCell align="right">
				<AmountYearlyConverted year={year} date={row?.date} id={row?.id} />
			</StyledTableCell>

			<StyledTableCell align="right">
				<DeleteRow id={row?.id} />
			</StyledTableCell>
		</StyledTableRow>
	);
};
