import React, { useRef } from 'react';
import { Button, ButtonGroup } from "@mui/material";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector, useCreateRow } from "../../../box/hooks";

const Buttons: React.FC = () => {
	const { years, rows } = useAppSelector((state) => state.tablesReducer);
	const handleCreateRow = useCreateRow();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// Сохранение данных в localStorage в виде JSON файла
	const handleSave = () => {
		const store = localStorage.getItem('persist:root');

		if (store) {
			const blob = new Blob([store], { type: 'application/json' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'tax-georgia.json';
			link.click();
			alert('Store saved as JSON file!');
		} else {
			alert('No data in localStorage to save!');
		}
	};

	// Загрузка данных из выбранного файла JSON
	const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const parsedStore = JSON.parse(e.target?.result as string);
					localStorage.setItem('persist:root', JSON.stringify(parsedStore));
					window.location.reload();
				} catch (error) {
					alert('Error loading the file. Ensure it is a valid JSON file.');
				}
			};
			reader.readAsText(file); // Читаем файл как текст
		}
	};

	// Триггер для открытия окна выбора файла
	const triggerFileInput = () => {
		fileInputRef.current?.click(); // Инициируем клик по скрытому input[type="file"]
	};

	return (
		<ButtonGroup variant="outlined" aria-label="Basic button group">
			<Button
				startIcon={<SaveAltIcon />}
				onClick={handleSave}
			>
				Сохранить
			</Button>
			<Button
				startIcon={<FileUploadIcon />}
				onClick={triggerFileInput}
			>
				Загрузить
				<input
					ref={fileInputRef}
					type="file"
					style={{ display: 'none' }}
					onChange={handleLoad}
				/>
			</Button>
			{(!years?.length && !rows?.length) && (
				<Button
					variant={'contained'}
					color={"success"}
					startIcon={<AddIcon />}
					onClick={() => handleCreateRow()}
				>
					Создать запись
				</Button>
			)}
		</ButtonGroup>
	);
};

export default Buttons;
