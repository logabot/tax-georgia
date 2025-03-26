import * as React from 'react';
import { useCallback } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../box/hooks";
import {
	IDefaultFinanceSettings,
	setCloseDefaultSettingsFormModal,
	setDefaultFinanceSettings
} from "../../store/root-reducers";
import { CURRENCIES } from "../../box/constants";

export const DefaultSettingsFormModal = () => {
	const dispatch = useAppDispatch();
	const open = useAppSelector(state => state.rootReducer.isOpenDefaultSettingsFormModal);
	const { currency, taxRate, amount } = useAppSelector(state => state.rootReducer.defaultFinanceSettings);

	const handleClose = () => {
		dispatch(setCloseDefaultSettingsFormModal());
	};

	const handleSubmit = useCallback((formJson: Partial<Record<keyof IDefaultFinanceSettings, any>>) => {
		dispatch(setDefaultFinanceSettings({
			currency: formJson.currency !== undefined ? { value: formJson.currency } : undefined,
			taxRate: formJson.taxRate !== undefined ? { value: Number(formJson.taxRate) } : undefined,
			amount: formJson.amount !== undefined ? { value: Number(formJson.amount) } : undefined,
		}));
	}, [dispatch]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
			slotProps={{
				paper: {
					component: 'form',
					onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const formJson = Object.fromEntries((formData as any).entries());

						handleSubmit(formJson);
						handleClose();
					},
				},
			}}
		>
			<DialogTitle>Настройки по умолчанию</DialogTitle>
			<DialogContent>
				<Box display="flex" flexDirection="column" gap="12px">
					<FormControl variant="filled" fullWidth>
						<InputLabel id={`${currency?.name}-label`}>{currency?.tooltip}</InputLabel>
						<Select
							labelId={`${currency?.name}-label`}
							id={currency?.name}
							name={currency?.name}
							defaultValue={currency?.value}
						>
							{CURRENCIES?.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
						</Select>
					</FormControl>
					<TextField
						id={taxRate?.name}
						label={taxRate?.tooltip}
						defaultValue={taxRate?.value}
						name={taxRate?.name}
						variant="filled"
						fullWidth
						type="number"
						inputProps={{
							min: 1,
							step: 'any',
							inputMode: 'numeric',
						}}
					/>
					<TextField
						id={amount?.name}
						label={amount?.tooltip}
						defaultValue={amount?.value}
						name={amount?.name}
						variant="filled"
						fullWidth
						type="number"
						inputProps={{
							min: 0,
							step: 'any',
							inputMode: 'numeric',
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ padding: "1.5em" }}>
				<Button onClick={handleClose}>Закрыть</Button>
				<Button variant={'contained'} color={'success'} type="submit">Сохранить</Button>
			</DialogActions>
		</Dialog>
	);
};