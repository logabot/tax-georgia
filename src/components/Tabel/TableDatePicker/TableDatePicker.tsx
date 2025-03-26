import React, { useEffect, useState } from 'react';
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
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const dayjsValue = dayjs(value);

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleOpen = () => {
		setIsOpen(true);
	};

	useEffect(() => {
		if (selectedDate && !isOpen) {
			const stringDate = dayjs(selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSS");
			onChange({ payload: { name, value: stringDate } });
		}
	}, [isOpen, name, onChange, row, selectedDate]);

	const handleDateChange = (newValue: Dayjs | null) => {
		setSelectedDate(newValue);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				key={dayjsValue.format("YYYY-MM-DDTHH:mm:ss.SSS")}
				label="Выберите дату"
				value={dayjsValue}
				onChange={(newValue: Dayjs | null) => handleDateChange(newValue)}
				onClose={handleClose}
				onOpen={handleOpen}
				slotProps={{ textField: { fullWidth: true, disabled: true } }}
				views={["day", "month", "year"]}
				format="DD.MM.YYYY"
				disabled={row?.status === "loading"}
				maxDate={dayjs()}
			/>
		</LocalizationProvider>
	);
};

export default TableDatePicker;