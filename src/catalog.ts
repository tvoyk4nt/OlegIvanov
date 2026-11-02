const productNames: string[] = [
    "Wireless mouse",
    "Mechanical keyboard",
    "Monitor",
    "Headphones",
    "Webcam",
    "USB hub"
];

const prices: number[] = [1490, 4990.5, 15990, 3290.75, 2790, 890];
const availability: boolean[] = [true, true, false, true, false, true];

const productRows: [string, number, boolean][] = [
    ["Wireless mouse", 1490, true],
    ["Mechanical keyboard", 4990.5, true],
    ["Monitor", 15990, false],
    ["Headphones", 3290.75, true],
    ["Webcam", 2790, false],
    ["USB hub", 890, true]
];

const firstRow: [string, number, boolean] = productRows[0];
console.log(`Первая запись: ${firstRow[0]}, цена ${firstRow[1]}`);

const availableRows = productRows.filter(row => row[2]);
const productLabels = productRows.map(row => `${row[0]} - ${row[1]} руб.`);
const totalPrice = prices.reduce((sum, price) => sum + price, 0);
const availableTotal = availableRows.reduce((sum, row) => sum + row[1], 0);
let currentState: "ready" = "ready";

function printStats(total: number, availableSum: number, availableCount: number): void {
    console.log("Статистика каталога");
    console.log(`Всего товаров: ${productNames.length}`);
    console.log(`Доступно товаров: ${availableCount}`);
    console.log(`Общая стоимость: ${total.toFixed(2)} руб.`);
    console.log(`Стоимость доступных: ${availableSum.toFixed(2)} руб.`);
}

function stopProgram(message: string): never {
    throw new Error(message);
}

function parsePrice(text: string): number {
    const value = Number(text);
    if (!Number.isFinite(value)) {
        stopProgram(`Некорректная цена: ${text}`);
    }
    if (value < 0) {
        stopProgram("Цена не может быть отрицательной.");
    }
    return value;
}

console.log(`Состояние: ${currentState}`);
console.log(productLabels);
console.log(`Наличие по массиву: ${availability}`);
printStats(totalPrice, availableTotal, availableRows.length);

["1500", "abc", "-200"].forEach(text => {
    try {
        console.log(`Цена принята: ${parsePrice(text)}`);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Ошибка: ${error.message}`);
        }
    }
});
