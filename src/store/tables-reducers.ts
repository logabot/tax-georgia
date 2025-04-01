import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency } from "./root-reducers";
import { API_TAX_RATE_URL } from "../box/constants";
import { AppThunk } from "./store";

export interface IYear {
	year: number,
	open: boolean,
}

export interface IRow {
	id: string,
	date: string,
	amount: number,
	currency: Currency,
	taxRate: number,
	exchangeRate: number,
	amountConverted: number,
	taxConverted: number,
	amountYearlyConverted: number
	status: "idle" | "loading" | "loaded" | "error";
}

interface IInitialState {
	years: IYear[],
	rows: IRow[],
	changedDate: string,
	exchangeRatesCache: Record<string, number>;
}

const initialState: IInitialState = {
	years: [],
	rows: [],
	changedDate: "",
	exchangeRatesCache: {},
};

export const fetchExchangeRate = createAsyncThunk(
	"tables/fetchExchangeRate",
	async ({ id, currency, date }: { id: string; currency: Currency; date: string }) => {
		const formattedDate = date.split('T')[0];

		const response = await fetch(`${API_TAX_RATE_URL}?currencies=${currency}&date=${formattedDate}`);

		if (!response.ok) {
			throw new Error("Failed to fetch exchange rate");
		}

		const data = await response.json();
		const exchangeRate = data[0]?.currencies[0]?.rate || 0; // Защита от отсутствия данных

		return { id, exchangeRate };
	}
);

export const maybeFetchExchangeRate = (row: IRow): AppThunk => (dispatch, getState) => {
	const key = `${row.currency}_${row.date}`;

	if (row.currency === 'GEL') {
		dispatch(setUpdateRow({
			...row,
			exchangeRate: 1,
			amountConverted: row.amount,
			taxConverted: row.amount * (row.taxRate / 100),
			status: 'loaded', // Устанавливаем статус `loaded` сразу
		}));
		return;
	}

	const cachedRate = getState().tablesReducer.exchangeRatesCache[key];

	if (cachedRate !== undefined) {
		dispatch(setUpdateRow({
			...row,
			exchangeRate: cachedRate,
			amountConverted: row.amount * cachedRate,
			taxConverted: (row.amount * cachedRate) * (row.taxRate / 100),
			status: 'loaded',
		}));
	} else if (row.status !== 'loading') {
		dispatch(fetchExchangeRate({ id: row.id, currency: row.currency, date: row.date }));
	}
};

const appSlice = createSlice({
	name: 'tables',
	initialState,
	reducers: {
		setOpenTable: (state, action: PayloadAction<number>) => {
			const year = state.years.find((year) => year.year === action.payload);
			if (year) {
				year.open = !year.open;
			}
		},
		setCreateRow: (state, action: PayloadAction<IRow>) => {
			state.rows.push(action.payload);
		},
		setUpdateRow: (state, action: PayloadAction<IRow>) => {
			const { id, ...updatedFields } = action.payload;
			const rowIndex = state.rows.findIndex((row) => row.id === id);
			if (rowIndex !== -1) {
				state.rows[rowIndex] = { ...state.rows[rowIndex], ...updatedFields, id };
			}
		},
		setUpdateChangedDate: (state, action: PayloadAction<string>) => {
			state.changedDate = action.payload;
		},
		deleteRow: (state, action: PayloadAction<string>) => {
			const dateToDelete = action.payload;
			state.rows = state.rows.filter((row) => row.id !== dateToDelete);
		},
		setYears: (state, action: PayloadAction<IYear[]>) => {
			state.years = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchExchangeRate.pending, (state, action) => {
				const { id } = action.meta.arg;
				const row = state.rows.find(row => row.id === id);
				if (row) {
					row.status = "loading";
				}
			})
			.addCase(fetchExchangeRate.fulfilled, (state, action) => {
				const { id, exchangeRate } = action.payload;
				const row = state.rows.find(row => row.id === id);
				if (row) {
					row.exchangeRate = exchangeRate;
					row.status = "loaded";
					row.amountConverted = row.amount * exchangeRate;
					row.taxConverted = row.amountConverted * (row.taxRate / 100);

					const key = `${row.currency}_${row.date}`;
					state.exchangeRatesCache[key] = exchangeRate;
				}
			})
			.addCase(fetchExchangeRate.rejected, (state, action) => {
				const { id } = action.meta.arg;
				const row = state.rows.find(row => row.id === id);
				if (row) {
					row.status = "error";
				}
			});
	},
});

export const {
	setOpenTable,
	setCreateRow,
	setUpdateRow,
	deleteRow,
	setYears,
	setUpdateChangedDate
} = appSlice.actions;

export default appSlice.reducer;
