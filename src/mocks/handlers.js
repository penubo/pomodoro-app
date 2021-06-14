// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('is-authenticated', 'true');

    return res(
      // Respond with a 200 status code
      ctx.status(200),
    );
  }),

  rest.get('http://localhost:3000/todos', (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 69,
          title: 'Second Todo',
          sprintTotal: 3,
          sprintDone: 0,
          todoDone: false,
        },
        {
          id: 70,
          title: 'Third Todo',
          sprintTotal: 3,
          sprintDone: 0,
          todoDone: false,
        },
        {
          id: 67,
          title: 'First Todo',
          sprintTotal: 4,
          sprintDone: 0,
          todoDone: false,
        },
      ]),
    );
  }),
];
