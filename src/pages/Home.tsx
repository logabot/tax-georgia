import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Button, Collapse, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Buttons from "../components/Tabel/Buttons/Buttons";
import Table from "../components/Tabel/Table";
import { useAppDispatch, useAppSelector, useCreateRow } from "../box/hooks";
import { setOpenTable, setYears } from "../store/tables-reducers";

const Home = () => {
	const dispatch = useAppDispatch()
	const years = useAppSelector(state => state.tablesReducer.years)
	const rows = useAppSelector(state => state.tablesReducer.rows)
	const handleCreateRow = useCreateRow();

	const sortYears = useCallback(() => {
		const yearsFromRows = [
			...new Set(rows.map(item => new Date(item.date).getFullYear()))
		].sort((a, b) => b - a);

		return yearsFromRows.map(year => {
			const yearFromState = years.find(y => y.year === year);
			return {
				year,
				open: yearFromState ? yearFromState.open : true
			};
		});
	}, [rows, years]);

	useEffect(() => {
		dispatch(setYears(sortYears()));
	}, [dispatch, sortYears]);

	const sortedYears = useMemo(() => sortYears(), [sortYears]);

	return (
		<>
			<Typography variant="h1" fontSize={32} fontWeight={900}>Калькулятор налогов Грузии</Typography>
			<Box paddingTop={5} paddingBottom={3}>
				<Buttons />
			</Box>

			{sortedYears?.map(({ year, open }) => (
				<Box key={year} component="section" sx={{ border: '1px dashed grey', mt: 3, borderRadius: 1 }}>
					<Button
						onClick={() => dispatch(setOpenTable(year))}
						variant="text"
						fullWidth
						sx={{padding: 3, justifyContent: 'flex-start', fontSize: 24}}
					>
						{`${year} год`}

						{open ? (
							<KeyboardArrowUpIcon fontSize={'large'} sx={{marginLeft: 'auto'}}/>
						) : (
							<KeyboardArrowDownIcon fontSize={'large'} sx={{marginLeft: 'auto'}} />
						)}
					</Button>
					<Collapse in={open}>
						<Box padding={2} sx={{borderTop: '1px dashed grey'}}>
							<Table year={year} />
							<Button
								variant={'contained'}
								color={'success'}
								onClick={() => handleCreateRow(year)}
							>
								Создать запись
							</Button>
						</Box>
					</Collapse>
				</Box>
			))}
		</>
	);
};

export default Home;