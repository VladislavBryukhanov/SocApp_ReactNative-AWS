import { createStore, combineReducers, applyMiddleware } from "redux";
import { usersReducer } from "./users/users.reducer";
import thunk from 'redux-thunk';
import { createLogger } from "redux-logger";

const rootReducer = combineReducers({
  userStore: usersReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const logger = createLogger({
  predicate: (state, action) => !action.type.includes('ping')
})

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);