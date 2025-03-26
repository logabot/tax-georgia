import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../store/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { IRow, maybeFetchExchangeRate, setCreateRow, setUpdateChangedDate } from "../store/tables-reducers";
import { API_TAX_RATE_URL } from "./constants";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useExchangeRate = (currency: string, date: string) => {
	const [rate, setRate] = useState<number | null>(null);

	useEffect(() => {
		if (!currency || !date) return;

		const fetchExchangeRate = async () => {
			try {
				const response = await fetch(`${API_TAX_RATE_URL}?date=${date}`);
				const data = await response.json();

				// Достаём курс нужной валюты
				const ratesByDate = data[0]?.currencies || [];
				const foundRate = ratesByDate.find((item: any) => item.code === currency)?.rate;

				setRate(foundRate || null);
			} catch (error) {
				console.error("Ошибка загрузки курса валют:", error);
				setRate(null);
			}
		};

		fetchExchangeRate();
	}, [currency, date]);

	return rate;
};

export const useCreateRow = () => {
	const dispatch = useAppDispatch();
	const defaultFinanceSettings = useAppSelector(state => state.rootReducer.defaultFinanceSettings);

	return useCallback((year?: number) => {
		const now = dayjs();
		const currentDateWithMillis = year
			? now.year(year).format("YYYY-MM-DDTHH:mm:ss.SSS") // Заменяем только год
			: now.format("YYYY-MM-DDTHH:mm:ss.SSS"); // Оставляем текущую дату

		const currency = defaultFinanceSettings?.currency?.value;
		const amount = defaultFinanceSettings?.amount?.value;
		const taxRate = defaultFinanceSettings?.taxRate?.value;

		const newRow: IRow = {
			id: currentDateWithMillis,
			date: currentDateWithMillis,
			amount,
			currency,
			taxRate,
			exchangeRate: 0,
			amountConverted: 0,
			taxConverted: 0,
			amountYearlyConverted: 0,
			status: 'idle'
		};

		dispatch(setCreateRow(newRow));
		dispatch(setUpdateChangedDate(currentDateWithMillis));
		dispatch(maybeFetchExchangeRate(newRow));
	}, [defaultFinanceSettings?.amount?.value, defaultFinanceSettings?.currency?.value, defaultFinanceSettings?.taxRate?.value, dispatch]);
};

export const useFilteredRows = (rows: IRow[], year: number) => {
	return useMemo(() =>
			rows
				.filter(item => new Date(item.date).getFullYear() === year)
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
		[rows, year]
	);
};
