export interface CompanyResponse {
	_id: string;
	user: string;
	region: string;
	itemCode: string;

	name: string;
	isFull: boolean;

	concreteInvested: number;
	production: number;

	activeUpgradeLevels: {
		storage: number;
		automatedEngine: number;
		breakRoom: number;
	};

	workerCount: number;
	estimatedValue: number;

	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface CompaniesResponse {
	items: string[];
}

export interface UpgradeByTypeResponse {
	_id: string;
	company: string;
	upgradeType: string;
	level: number;
	status: 'active';
	investedMoney: number;
	investedConcrete: number;
	investedSteel: number;
	dependantUsersCount: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ProductionBonusResponse {
	strategicBonus: number;
	depositBonus: number;
	ethicSpecializationBonus: number;
	ethicDepositBonus: number;
	total: number;
}

export interface WageStatsResponse {
	allowedRange: {
		min: number;
		max: number;
		average: number;
	};
	topOffer: number;
	topEligibleOffer: number;
	topEligibleOffers: {
		_id: string;
		company: string;
		user: string;
		region: string;
		quantity: number;
		initialQuantity: number;
		wage: number;
		createdAt: string;
		updatedAt: string;
		__v: number;
	}[];
}
