type TodoItem = {
  id: number;
  title: string;
  sprintTotal: number;
  sprintDone: number;
  todoDone: boolean;
};

type TodoList = Array<TodoItem>;

export {TodoItem, TodoList};
