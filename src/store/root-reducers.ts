import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Currency = "EUR" | "USD" | "GEL";

export enum FinanceSettingNames {
	Currency = "currency",
	TaxRate = "taxRate",
	Amount = "amount",
}

export interface IDefaultFinanceSettings {
	currency: { name: FinanceSettingNames.Currency, tooltip: string, value: Currency },
	taxRate: { name: FinanceSettingNames.TaxRate, tooltip: string, value: number }
	amount: { name: FinanceSettingNames.Amount, tooltip: string, value: number }
}

interface IInitialState {
	isDarkMode: boolean;
	defaultFinanceSettings: IDefaultFinanceSettings;
	isOpenDefaultSettingsFormModal: boolean;
}

const initialState: IInitialState = {
	isDarkMode: true,
	defaultFinanceSettings: {
		currency: {
			name: FinanceSettingNames.Currency,
			tooltip: 'Валюта по умолчанию',
			value: "EUR"
		},
		taxRate: {
			name: FinanceSettingNames.TaxRate,
			tooltip: 'Налоговая ставка (%)',
			value: 1
		},
		amount: {
			name: FinanceSettingNames.Amount,
			tooltip: "Сумма по умолчанию",
			value: 0
		}
	},
	isOpenDefaultSettingsFormModal: false
};

const appSlice = createSlice({
	name: 'root',
	initialState,
	reducers: {
		setToggleTheme: (state) => {
			state.isDarkMode = !state.isDarkMode;
		},
		setOpenDefaultSettingsFormModal: (state) => {
			state.isOpenDefaultSettingsFormModal = true;
		},
		setCloseDefaultSettingsFormModal: (state) => {
			state.isOpenDefaultSettingsFormModal = false;
		},
		setDefaultFinanceSettings: (state, action: PayloadAction<Partial<Record<keyof IDefaultFinanceSettings, { value: any }>>>) => {
			Object.entries(action.payload).forEach(([key, updatedValue]) => {
				if (state.defaultFinanceSettings[key as keyof IDefaultFinanceSettings]) {
					state.defaultFinanceSettings[key as keyof IDefaultFinanceSettings].value = updatedValue.value;
				}
			});
		}
	},
});

export const {
	setToggleTheme,
	setOpenDefaultSettingsFormModal,
	setCloseDefaultSettingsFormModal,
	setDefaultFinanceSettings
} = appSlice.actions;

export default appSlice.reducer;