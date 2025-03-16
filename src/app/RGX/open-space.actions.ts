import { createAction, props } from '@ngrx/store';

export const loadOpenSpaces = createAction('[OpenSpace] Load Open Spaces');
export const loadOpenSpacesSuccess = createAction('[OpenSpace] Load Open Spaces Success', props<{ openSpaces: any[] }>());
export const loadOpenSpacesFailure = createAction('[OpenSpace] Load Open Spaces Failure', props<{ error: any }>());
