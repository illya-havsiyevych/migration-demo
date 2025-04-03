import { combineEpics, ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { SettingsActions } from './settings.slice';

// Placeholder for any settings-related epics
const initSettingsEpic = (action$: any) =>
  action$.pipe(
    ofType(SettingsActions.initSettings.type),
    tap(() => {
      console.log('Settings initialized');
    }),
    mergeMap(() => of())
  );

export const settingsEpic = combineEpics(
  initSettingsEpic
);
