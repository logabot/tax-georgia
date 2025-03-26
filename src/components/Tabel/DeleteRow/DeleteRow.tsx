import React, { FC, useCallback, useState } from 'react';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { deleteRow } from "../../../store/tables-reducers";
import { useAppDispatch } from "../../../box/hooks";

interface IDeleteRowProps {
	id: string;
}

export const DeleteRow: FC<IDeleteRowProps> = ({ id }) => {
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	const handleOpen = useCallback(() => {
		setOpen(true);
	}, []);

	const handleDeleteRow = useCallback(() => {
		dispatch(deleteRow(id));
	}, [dispatch, id]);

	return (
		<>
			<IconButton color={'error'} onClick={handleOpen}>
				<DeleteForeverIcon />
			</IconButton>

			<Dialog
				open={open}
				fullWidth
				maxWidth="xs"
				onClose={handleClose}
			>
				<DialogTitle>Вы уверены, что хотите удалить запись?</DialogTitle>
				<DialogContent>
					<DialogActions sx={{ padding: "1.5em" }}>
						<Button onClick={handleClose}>Отмена</Button>
						<Button variant={'contained'} color={'error'} onClick={handleDeleteRow}>Удалить</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</>
	);
};