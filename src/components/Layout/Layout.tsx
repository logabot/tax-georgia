import React from 'react';
import Header from "../Header/Header";
import { Box, Toolbar } from "@mui/material";
import { DefaultSettingsFormModal } from "../DefaultSettingsFormModal/DefaultSettingsFormModal";

interface ILayoutProps {
	children?: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
	return (
		<>
			<Header />
			<Box component="main" sx={{ p: 3 }}>
				<Toolbar />
				{children}
			</Box>
			<DefaultSettingsFormModal />
		</>
	);
};

export default Layout;