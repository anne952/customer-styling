import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CartItem } from "./cart-context";

export type OrderLine = {
	id: number;
	name: string;
	quantity: number;
	price: number;
	image?: any;
};

export type PlacedOrder = {
	id: string;
	createdAt: number;
	items: OrderLine[];
	subtotal: number;
	discount: number;
	total: number;
	paymentMethodId: string | null;
};

type OrderContextValue = {
	selectedPaymentMethodId: string | null;
	setSelectedPaymentMethod: (id: string | null) => void;
	lastOrder: PlacedOrder | null;
	placeOrder: (params: { items: CartItem[]; discount?: number }) => PlacedOrder;
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
	const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

	const setSelectedPaymentMethod = useCallback((id: string | null) => {
		setSelectedPaymentMethodId(id);
	}, []);

	const placeOrder: OrderContextValue["placeOrder"] = useCallback(({ items, discount = 0 }) => {
		const lines: OrderLine[] = items.map((it) => ({ id: it.id, name: it.name, quantity: it.quantity, price: it.price, image: it.image }));
		const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
		const total = Math.max(0, subtotal - discount);
		const order: PlacedOrder = {
			id: String(Date.now()),
			createdAt: Date.now(),
			items: lines,
			subtotal,
			discount,
			total,
			paymentMethodId: selectedPaymentMethodId,
		};
		setLastOrder(order);
		return order;
	}, [selectedPaymentMethodId]);

	const value = useMemo(() => ({ selectedPaymentMethodId, setSelectedPaymentMethod, lastOrder, placeOrder }), [selectedPaymentMethodId, setSelectedPaymentMethod, lastOrder, placeOrder]);

	return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
	const ctx = useContext(OrderContext);
	if (!ctx) throw new Error("useOrder must be used within OrderProvider");
	return ctx;
};
