import { configureStore, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import rootReducer from "./root-reducers";
import tablesReducer from "./tables-reducers";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "root",
	storage,
};

const rootReducerCombined = combineReducers({
	rootReducer,
	tablesReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducerCombined);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					"persist/PERSIST",
					"persist/REHYDRATE",
					"persist/PAUSE",
					"persist/FLUSH",
					"persist/PURGE",
					"persist/REGISTER",
				],
			},
		}),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
	RootState,
	unknown,
	UnknownAction>;
