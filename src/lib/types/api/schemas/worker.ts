export interface WorkerData {
	_id: string;
	user: string;
	company: string;
	employer: string;

	wage: number;
	fidelity: number;

	joinedAt: string;
	lastFidelityIncreaseAt: string;

	lockedUntil?: string;

	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface CompanyInfo {
	_id: string;
	name: string;
	itemCode: string;
}

export interface WorkersPerCompanyItem {
	company: CompanyInfo;
	workers: WorkerData[];
}

export interface WorkersByCompanyResponse {
	type: 'company';
	workers: WorkerData[];
}

export interface WorkersByUserResponse {
	type: 'user';
	workersPerCompany: WorkersPerCompanyItem[];
}
