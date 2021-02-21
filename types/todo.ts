type TodoItem = {
  id: number;
  title: string;
  sprintTotal: number;
};

type TodoList = Array<TodoItem>;

export { TodoItem, TodoList };
