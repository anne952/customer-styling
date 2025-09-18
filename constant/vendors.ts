export type Vendor = {
	id: string;
	name: string;
	email: string;
	avatar?: string;
};

const Vendors: Vendor[] = [
	{
		id: 'shooda',
		name: 'Shooda fashion',
		email: 'ShoodaFashion@gmail.com',
		avatar: 'https://via.placeholder.com/150',
	},
];

export default Vendors;
