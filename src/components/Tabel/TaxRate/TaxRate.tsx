import React, { FC, useEffect } from 'react';
import { IRow, maybeFetchExchangeRate } from "../../../store/tables-reducers";
import { useAppDispatch } from "../../../box/hooks";

interface ITaxRateProps {
	row: IRow;
}

export const TaxRate: FC<ITaxRateProps> = ({ row }) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (row.status === 'idle') {
			dispatch(maybeFetchExchangeRate(row));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, row.status, row.id, row.currency, row.date]);

	return (
		<>
			{row?.status === "loading" && <span>...</span>}
			{row?.status === "error" && <span>Ошибка загрузки</span>}
			{row?.status === "loaded" && <span>{!row?.exchangeRate ? "Курс не найден" : row?.exchangeRate}</span>}
		</>
	);
};
