// localStorageUtils.ts
export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('reduxState');
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.error('Could not load state from localStorage', err);
		return undefined;
	}
};

export const saveState = (state: any) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('reduxState', serializedState);
	} catch (err) {
		console.error('Could not save state to localStorage', err);
	}
};