const products = [
    { id: 1, name: "Laptop", price: 80000, quantity: 2, category: "electronics" },
    { id: 2, name: "Mouse", price: 2500, quantity: 5, category: "electronics" },
    { id: 3, name: "Keyboard", price: 4500, quantity: 3, category: "electronics" },
    { id: 4, name: "Chair", price: 18000, quantity: 1, category: "furniture" },
    { id: 5, name: "Desk", price: 25000, quantity: 2, category: "furniture" }
];

function getProductTotal(product) {
    return product.price * product.quantity;
}

function getTotalInventoryValue(products) {
    return products.reduce((total, product) => total + getProductTotal(product), 0);
}

function getMostExpensiveProduct(products) {
    if (products.length === 0) {
        return undefined;
    }

    return products.reduce((mostExpensive, product) =>
        product.price > mostExpensive.price ? product : mostExpensive
    );
}

function filterByCategory(products, category) {
    return products.filter(product => product.category === category);
}

function findProduct(products, id) {
    return products.find(product => product.id === id);
}

function getAvailableProducts(products) {
    return products.filter(product => product.quantity > 0);
}

function getCategoryStatistics(products) {
    return products.reduce((statistics, product) => {
        if (!statistics[product.category]) {
            statistics[product.category] = {
                count: 0,
                totalValue: 0
            };
        }

        statistics[product.category].count += 1;
        statistics[product.category].totalValue += getProductTotal(product);
        return statistics;
    }, {});
}

function updateProductQuantity(products, id, quantity) {
    return products.map(product =>
        product.id === id ? { ...product, quantity } : product
    );
}

function sortProductsByPrice(products) {
    return [...products].sort((a, b) => a.price - b.price);
}

console.log("Каталог товаров");
console.log("Стоимость каждого товара:");

products.forEach(product => {
    console.log(product.name + ": " + getProductTotal(product) + " руб.");
});

console.log("Общая стоимость каталога: " + getTotalInventoryValue(products) + " руб.");

const mostExpensive = getMostExpensiveProduct(products);
if (mostExpensive !== undefined) {
    console.log("Самый дорогой товар: " + mostExpensive.name + ", " + mostExpensive.price + " руб.");
}

console.log("Электроника:", filterByCategory(products, "electronics"));
console.log("Товар с id 3:", findProduct(products, 3));
console.log("Товары в наличии:", getAvailableProducts(products));
console.log("Статистика по категориям:", getCategoryStatistics(products));

const updatedProducts = updateProductQuantity(products, 2, 10);
console.log("Каталог после изменения количества:", updatedProducts);
console.log("Сортировка по цене:", sortProductsByPrice(products));
console.log("Исходный каталог не изменился:", products);
