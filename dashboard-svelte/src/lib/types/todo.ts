export interface Todo {
	id: number;
	text: string;
	category: string;
	priority: 'high' | 'medium' | 'low';
	quadrant: 'q1' | 'q2' | 'q3' | 'q4';
	done: boolean;
	created: string;
}
