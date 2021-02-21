type TodoItem = {
  id: number;
  title: string;
  sprintTotal: number;
  sprintEnded: number;
};

type TodoList = Array<TodoItem>;

export { TodoItem, TodoList };
