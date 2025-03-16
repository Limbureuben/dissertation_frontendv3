import { createReducer, on } from '@ngrx/store';
import { loadOpenSpaces, loadOpenSpacesSuccess } from './open-space.actions';

export interface OpenSpaceState {
  openSpaces: any[];
  loading: boolean;
}

const initialState: OpenSpaceState = {
  openSpaces: [],
  loading: false,
};

export const openSpaceReducer = createReducer(
  initialState,
  on(loadOpenSpaces, (state) => ({ ...state, loading: true })),
  on(loadOpenSpacesSuccess, (state, { openSpaces }) => ({ ...state, loading: false, openSpaces }))
);
