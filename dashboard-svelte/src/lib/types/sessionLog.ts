export interface SessionCategory {
	name: string;
	count: number;
	pct: number;
}

export interface SessionLog {
	id: number;
	date: string;
	topCategory: string;
	tags: string[];
	summary: string;
	categories: SessionCategory[];
	tasks: string[];
	details: string;
	relatedProjects: string[];
}
