import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CartItem } from "./cart-context";
import { notifyOrderAccepted, notifyOrderDelivered } from "./notifications";

export type OrderStatus = 'pending' | 'accepted' | 'out_for_delivery' | 'delivered_vendor' | 'delivered_confirmed' | 'delivery_disputed';

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
	status: OrderStatus;
};

type OrderContextValue = {
	selectedPaymentMethodId: 'Tmoney' | 'Flooz' | null;
	setSelectedPaymentMethod: (id: 'Tmoney' | 'Flooz' | null) => void;
	lastOrder: PlacedOrder | null;
	orders: PlacedOrder[];
	placeOrder: (params: { items: CartItem[]; discount?: number }) => PlacedOrder;
	setOrderStatus: (orderId: string, status: OrderStatus) => void;
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<'Tmoney' | 'Flooz' | null>(null);
	const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
	const [orders, setOrders] = useState<PlacedOrder[]>([]);

	const setSelectedPaymentMethod = useCallback((id: 'Tmoney' | 'Flooz' | null) => {
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
			status: 'pending',
		};
		setLastOrder(order);
		setOrders((prev) => [order, ...prev]);
		return order;
	}, [selectedPaymentMethodId]);

	const setOrderStatus: OrderContextValue["setOrderStatus"] = useCallback((orderId, status) => {
		setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
		setLastOrder((prev) => (prev && prev.id === orderId ? { ...prev, status } : prev));
		if (status === 'accepted') notifyOrderAccepted(orderId);
		if (status === 'delivered_vendor') notifyOrderDelivered(orderId);
	}, []);

	const value = useMemo(() => ({ selectedPaymentMethodId, setSelectedPaymentMethod, lastOrder, orders, placeOrder, setOrderStatus }), [selectedPaymentMethodId, setSelectedPaymentMethod, lastOrder, orders, placeOrder, setOrderStatus]);

	return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
	const ctx = useContext(OrderContext);
	if (!ctx) throw new Error("useOrder must be used within OrderProvider");
	return ctx;
};
