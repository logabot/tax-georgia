import React, { FC, useEffect, useMemo } from 'react';
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector, useFilteredRows } from "../../../box/hooks";
import { setUpdateRow } from "../../../store/tables-reducers";
import CopyToClipboard from "../../CopyToClipboard/CopyToClipboard";

interface IAmountYearlyConvertedProps {
	year: number,
	date: string,
	id: string // Добавим id, чтобы обновлять конкретную строку
}

export const AmountYearlyConverted: FC<IAmountYearlyConvertedProps> = ({ year, date, id }) => {
	const dispatch = useAppDispatch();
	const rows = useAppSelector(state => state.tablesReducer.rows);
	const row = rows.find(row => row.id === id);

	const filteredRows = useFilteredRows(rows, year);

	const amountYearlyConverted = useMemo(() => {
		const targetDate = dayjs(date);

		const filteredData = filteredRows.filter(item => dayjs(item.date).isBefore(targetDate) || dayjs(item.date).isSame(targetDate));

		return filteredData.reduce((sum, item) => sum + item.amountConverted, 0);
	}, [date, filteredRows]);

	// Обновляем состояние при изменении amountYearlyConverted, но только если оно изменилось
	useEffect(() => {
		if (row && row.amountYearlyConverted !== amountYearlyConverted) {
			dispatch(setUpdateRow({ ...row, amountYearlyConverted }));
		}
	}, [amountYearlyConverted, dispatch, id, row, rows]); // Добавляем rows в зависимости

	return (
		<>
			<CopyToClipboard text={row?.amountYearlyConverted?.toFixed(2) || ''}>
				{row?.amountYearlyConverted?.toFixed(2) || ''}
			</CopyToClipboard>
		</>
	);
};
