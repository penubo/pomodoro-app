type TodoItem = {
  id: number;
  title: string;
  sprintTotal: number;
  sprintEnded: number;
  done: boolean;
};

type TodoList = Array<TodoItem>;

export { TodoItem, TodoList };
