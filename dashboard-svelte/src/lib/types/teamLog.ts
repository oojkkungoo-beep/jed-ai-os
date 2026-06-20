export interface AgentLog {
	id: string;
	name: string;
	emoji: string;
	title: string;
	summary: string;
	highlights: string[];
	url: string;
	full: string;
}

export interface TeamLogDay {
	date: string;
	dateDisplay: string;
	agents: AgentLog[];
}
