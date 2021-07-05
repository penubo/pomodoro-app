import type {TodoItem} from 'types/todo';
import axios from 'axios';
import useSWR, {mutate} from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

function useTodos() {
	const {data, error} = useSWR<Array<TodoItem>>(
		'http://localhost:3000/todos',
		fetcher,
	);

	async function createNewTodo(body: Pick<TodoItem, 'title' | 'todoDone' | 'sprintDone' | 'sprintTotal'>) {
		let newData: Array<TodoItem> = [{...body, id: -1}];
		if (data && data.length > 0) {
			newData = [...data, ...newData]
		}

		mutate('http://localhost:3000/todos', newData, false);

		const headers = {
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
		}

		await axios.post(`http://localhost:3000/todos`,
			body,
			headers
		);

		mutate('http://localhost:3000/todos');
	}

	return {data, error, createNewTodo};
}

export default useTodos;
