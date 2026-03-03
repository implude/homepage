export interface Member {
	name: string;
	role: string;
	description: string;
	image?: string;
}

export interface Generation {
	label: string;
	year: string;
	members: Member[];
}
