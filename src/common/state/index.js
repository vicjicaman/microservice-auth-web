import {
  combineReducers
} from 'redux';

export const watchers = [];
export const reducers = {
  visibilityFilter: 'SHOW_ALL',
  todos: [{
      text: 'Consider using Redux',
      completed: true
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
};
