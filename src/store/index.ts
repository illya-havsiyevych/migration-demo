import { configureStore } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { catchError } from 'rxjs/operators';

import conversationsReducer from './conversations/conversations.slice';
import modelsReducer from './models/models.slice';
import settingsReducer from './settings/settings.slice';
import uiReducer from './ui/ui.slice';

// Create the epic middleware
const epicMiddleware = createEpicMiddleware();

// Configure the Redux store
export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    models: modelsReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(epicMiddleware),
});

// Import epics after store is created to avoid circular dependencies
import { conversationsEpic } from './conversations/conversations.epic';
import { modelsEpic } from './models/models.epic';
import { settingsEpic } from './settings/settings.epic';

// Combine all epics
const rootEpic = (action$: any, store$: any, dependencies: any) =>
  combineEpics(
    conversationsEpic,
    modelsEpic,
    settingsEpic,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error('Error in epic:', error);
      return source;
    })
  );

// Run the root epic after store is created
epicMiddleware.run(rootEpic);

// Store the redux store in the window object for access from other modules
if (typeof window !== 'undefined') {
  window['__REDUX_STORE__'] = store;
}

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;