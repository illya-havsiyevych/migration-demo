import { combineEpics, ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { ModelsActions } from './models.slice';
import * as modelsApi from '@/api/models';

// Epic for fetching models
const fetchModelsEpic = (action$: any) =>
  action$.pipe(
    ofType(ModelsActions.fetchModels.type),
    mergeMap(() =>
      from(modelsApi.getModels()).pipe(
        map((response) => ModelsActions.fetchModelsSuccess(response.models)),
        catchError((error) =>
          of(ModelsActions.fetchModelsFailure(error.message || 'Failed to fetch models'))
        )
      )
    )
  );

// Epic for fetching addons
const fetchAddonsEpic = (action$: any) =>
  action$.pipe(
    ofType(ModelsActions.fetchAddons.type),
    mergeMap(() =>
      from(modelsApi.getAddons()).pipe(
        map((response) => ModelsActions.fetchAddonsSuccess(response.addons)),
        catchError((error) =>
          of(ModelsActions.fetchAddonsFailure(error.message || 'Failed to fetch addons'))
        )
      )
    )
  );

export const modelsEpic = combineEpics(
  fetchModelsEpic,
  fetchAddonsEpic
);
