interface OrderItem {
    id: number;
    title: string;
    unitPrice: number;
    quantity: number;
}

interface Order {
    id: number;
    customer: string;
    items: OrderItem[];
    discountPercent?: number;
}

type PriceFormatter = (value: number) => string;
type OrderPredicate = (order: Order) => boolean;

const orders: Order[] = [
    {
        id: 101,
        customer: "Иван Петров",
        items: [
            { id: 1, title: "Беспроводная мышь", unitPrice: 1490, quantity: 2 },
            { id: 2, title: "Клавиатура", unitPrice: 3200, quantity: 1 }
        ],
        discountPercent: 10
    },
    {
        id: 102,
        customer: "Мария Соколова",
        items: [
            { id: 3, title: "Монитор", unitPrice: 12990, quantity: 1 },
            { id: 4, title: "Кабель HDMI", unitPrice: 590, quantity: 3 }
        ]
    },
    {
        id: 103,
        customer: "Алексей Смирнов",
        items: [
            { id: 5, title: "Наушники", unitPrice: 2750, quantity: 2 },
            { id: 6, title: "USB-концентратор", unitPrice: 890, quantity: 1 }
        ],
        discountPercent: 5
    }
];

function calculateItemTotal(item: OrderItem): number {
    return item.unitPrice * item.quantity;
}

function calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

function applyDiscount(subtotal: number, percent: number = 0): number {
    if (percent < 0 || percent > 100) {
        throw new Error("Скидка должна быть в диапазоне от 0 до 100 процентов.");
    }

    return subtotal - subtotal * percent / 100;
}

function formatPrice(value: number, currency: string = "RUB"): string {
    return value.toFixed(2) + " " + currency;
}

function formatOrder(
    order: Order,
    formatter: PriceFormatter = formatPrice
): string {
    const subtotal = calculateSubtotal(order.items);
    const discount = order.discountPercent ?? 0;
    const total = applyDiscount(subtotal, discount);

    return "Заказ №" + order.id +
        ", покупатель: " + order.customer +
        ", сумма: " + formatter(total);
}

function selectItems(
    items: OrderItem[],
    predicate: (item: OrderItem) => boolean
): OrderItem[] {
    return items.filter(predicate);
}

const expensiveItems = (item: OrderItem): boolean => item.unitPrice > 2000;
const multipleItems = (item: OrderItem): boolean => item.quantity > 1;

console.log("Сводки заказов:");
orders.forEach(order => {
    console.log(formatOrder(order));
});

// Для одного заказа используем собственную функцию форматирования.
const formatInEuros: PriceFormatter = value => value.toFixed(2) + " EUR";
console.log(formatOrder(orders[0], formatInEuros));

// Выбираем позиции с помощью двух разных callback.
orders.forEach(order => {
    console.log("Дорогие позиции заказа " + order.id + ":",
        selectItems(order.items, expensiveItems));
    console.log("Позиции с количеством больше одного в заказе " + order.id + ":",
        selectItems(order.items, multipleItems));
});

// Собираем названия всех позиций в массив строк.
const allItems: OrderItem[] = orders.reduce(
    (items, order) => items.concat(order.items),
    [] as OrderItem[]
);
const itemTitles: string[] = allItems.map(item => item.title);
console.log("Названия позиций:", itemTitles);

// Ищем позицию и отдельно обрабатываем ситуацию, когда её нет.
const foundItem = allItems.find(item => item.id === 3);
if (foundItem !== undefined) {
    console.log("Найдена позиция:", foundItem.title);
} else {
    console.log("Позиция не найдена.");
}

const missingItem = allItems.find(item => item.id === 999);
if (missingItem !== undefined) {
    console.log("Найдена позиция:", missingItem.title);
} else {
    console.log("Позиция с id 999 не найдена.");
}

// Считаем общую стоимость всех заказов с учётом скидок.
const totalOrdersPrice: number = orders.reduce((sum, order) => {
    const subtotal = calculateSubtotal(order.items);
    return sum + applyDiscount(subtotal, order.discountPercent ?? 0);
}, 0);
console.log("Общая стоимость заказов:", formatPrice(totalOrdersPrice));

// Дополнительная часть: отбор заказов по отдельному callback.
const largeOrder: OrderPredicate = order => calculateSubtotal(order.items) >= 5000;

function selectOrders(
    source: Order[],
    predicate: OrderPredicate
): Order[] {
    return source.filter(predicate);
}

console.log("Крупные заказы:", selectOrders(orders, largeOrder));

// Rest-параметр принимает любое количество чисел.
function sumValues(...values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0);
}

console.log("Сумма без аргументов:", sumValues());
console.log("Сумма одного числа:", sumValues(15));
console.log("Сумма нескольких чисел:", sumValues(10, 20, 30, 40));

// Преобразуем позиции через callback, не меняя исходный массив.
type ItemTransformer = (item: OrderItem) => OrderItem;

function transformItems(
    items: OrderItem[],
    transformer: ItemTransformer
): OrderItem[] {
    return items.map(item => transformer(item));
}

const discountedItems = transformItems(orders[0].items, item => ({
    ...item,
    unitPrice: item.unitPrice * 0.9
}));

console.log("Позиции после изменения цены:", discountedItems);
console.log("Исходные позиции:", orders[0].items);

// Перегрузка: функция принимает строковый код или числовой номер заказа.
function formatOrderCode(code: string): string;
function formatOrderCode(id: number): string;
function formatOrderCode(value: string | number): string {
    if (typeof value === "string") {
        return "Код заказа: " + value;
    }

    return "Номер заказа: " + value;
}

console.log(formatOrderCode("ORD-2026-101"));
console.log(formatOrderCode(101));

// Объект параметров вместо нескольких отдельных аргументов.
interface OrderSearchOptions {
    customer: string;
    minTotal?: number;
}

function searchOrder(options: OrderSearchOptions): Order[] {
    return orders.filter(order => {
        const customerMatches = order.customer === options.customer;
        const total = calculateSubtotal(order.items);
        const totalMatches = options.minTotal === undefined ||
            total >= options.minTotal;

        return customerMatches && totalMatches;
    });
}

console.log("Поиск с объектом параметров:",
    searchOrder({ customer: "Иван Петров", minTotal: 1000 }));

// Тот же поиск с отдельными параметрами потребовал бы такой вызов:
function searchOrderByValues(customer: string, minTotal: number = 0): Order[] {
    return searchOrder({ customer, minTotal });
}

console.log("Поиск с отдельными параметрами:",
    searchOrderByValues("Иван Петров", 1000));
