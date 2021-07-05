import type {TodoItem} from 'types/todo';
import axios from 'axios';
import useSWR, {mutate} from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

function useTodos() {
	const {data: todos, error} = useSWR<Array<TodoItem>>(
		'http://localhost:3000/todos',
		fetcher,
	);

	async function createNewTodo(data: Pick<TodoItem, 'title' | 'todoDone' | 'sprintDone' | 'sprintTotal'>) {
		let newData: Array<TodoItem> = [{...data, id: -1}];
		if (todos && todos.length > 0) {
			newData = [...todos, ...newData]
		}

		mutate('http://localhost:3000/todos', newData, false);

		const headers = {
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
		}

		await axios.post(`http://localhost:3000/todos`,
			data,
			headers
		);

		mutate('http://localhost:3000/todos');
	}

	return {todos, error, createNewTodo};
}

export default useTodos;
