import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { authReducer } from './auth/auth.reducer';
import { usersReducer } from './users/users.reducer';
import { modalReducer } from './modal/modal.reducer';

const rootReducer = combineReducers({
  authModule: authReducer,
  usersModule: usersReducer,
  modalModule: modalReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const logger = createLogger({
  predicate: (state, action) => !action.type.includes('ping')
})

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);