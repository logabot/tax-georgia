import Home from "../pages/Home";
import Dock from "../pages/Dock";

export const routes = [
	{
		name: 'Калькулятор',
		path: '/',
		component: Home,
	},
	{
		name: 'Информация',
		path: '/dock',
		component: Dock,
	}
];