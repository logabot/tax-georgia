import React, { useCallback } from 'react';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { IRow } from "../../../store/tables-reducers";
import { IHandleUpdateRow } from "../Table";

interface ITableDatePickerProps {
	onChange: ({ payload }: IHandleUpdateRow) => void,
	value: string,
	row: IRow,
	name: string
}

const TableDatePicker: React.FC<ITableDatePickerProps> = ({ row, value, name, onChange }) => {

	const dayjsValue = dayjs(value);

	const setSelectedDate = useCallback((newValue: Dayjs | null) => {
		const stringDate = dayjs(newValue).format("YYYY-MM-DDTHH:mm:ss.SSS");
		onChange({ payload: { name, value: stringDate } });
	}, [name, onChange]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				key={dayjsValue.format("YYYY-MM-DDTHH:mm:ss.SSS")}
				label="Выберите дату"
				value={dayjsValue}
				onChange={(newValue: Dayjs | null) => setSelectedDate(newValue)}
				slotProps={{ textField: { fullWidth: true, disabled: true } }}
				views={["year", "day"]}
				format="DD.MM.YYYY"
				disabled={row?.status === "loading"}
				maxDate={dayjs()}
			/>
		</LocalizationProvider>
	);
};

export default TableDatePicker;