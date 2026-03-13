export interface Order {
	_id: string;
	user: string;
	itemCode: string;

	quantity: number;
	price: number;

	offerAt: string;

	type: 'buy' | 'sell';

	country?: string;

	__v: number;
}

export interface TopOrdersResponse {
	buyOrders: Order[];
	sellOrders: Order[];
}
