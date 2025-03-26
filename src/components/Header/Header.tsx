import React, { JSX, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
	AppBar,
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Tooltip
} from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PercentIcon from '@mui/icons-material/Percent';
import PaymentsIcon from '@mui/icons-material/Payments';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useAppDispatch, useAppSelector } from "../../box/hooks";
import { FinanceSettingNames, setOpenDefaultSettingsFormModal, setToggleTheme } from "../../store/root-reducers";
import { routes } from "../../box/routes";

const ICON_MAP: Record<string, JSX.Element> = {
	currency: <AccountBalanceIcon color={'primary'} />,
	taxRate: <PercentIcon color={'primary'} />,
	amount: <PaymentsIcon color={'primary'} />
};

const Header = () => {
	const dispatch = useAppDispatch();
	const defaultFinanceSettings = useAppSelector(state => state.rootReducer.defaultFinanceSettings);
	const isDarkMode = useAppSelector(state => state.rootReducer.isDarkMode);

	const handleToggleTheme = useCallback(() => {
		dispatch(setToggleTheme());
	}, [dispatch]);

	const handleOpenDefaultSettingsFormModal = useCallback(() => {
		dispatch(setOpenDefaultSettingsFormModal());
	}, [dispatch]);

	return (
		<AppBar component="nav" color={'default'}>
			<Toolbar>
				<Box display="flex" alignItems="center" gap="46px" minWidth="100%">
					<List sx={{ display: "flex", marginRight: "auto" }}>
						{routes.map((item) => (
							<ListItem key={item.name} disablePadding>
								<NavLink
									to={item.path}
									style={({ isActive }) => ({
										textDecoration: 'none',
										color: isActive ? "white" : "currentColor",
										backgroundColor: isActive ? "#1976d2" : "transparent",
										borderRadius: 4,
										overflow: "hidden"
									})}
								>
									<ListItemButton sx={{ textAlign: 'center' }}>
										<ListItemText primary={item.name} />
									</ListItemButton>
								</NavLink>
							</ListItem>
						))}
					</List>

					{Object.entries(defaultFinanceSettings).map(([key, item]) => (
						<Tooltip key={key} title={item?.tooltip} arrow>
							<Box display="flex" alignItems="center" gap="8px" fontWeight={900}>
								{ICON_MAP[item?.name] || null}
								{item?.value}
								{item?.name === FinanceSettingNames.Amount && ` ${defaultFinanceSettings?.currency?.value}`}
							</Box>
						</Tooltip>
					))}

					<Divider orientation="vertical" variant="middle" flexItem />

					<Box
						display="flex"
						alignItems="center"
						gap="12px"
					>
						<IconButton onClick={handleToggleTheme}>
							{isDarkMode ? (
								<LightModeIcon color={'primary'} />
							) : (
								<DarkModeIcon color={'primary'} />
							)}
						</IconButton>

						<IconButton onClick={handleOpenDefaultSettingsFormModal}>
							<SettingsIcon color={'primary'} />
						</IconButton>
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;