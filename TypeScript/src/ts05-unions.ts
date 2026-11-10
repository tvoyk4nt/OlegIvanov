// TS-05. Объединения типов и сужение

interface Product {
    id: number;
    title: string;
    price: number;
}

// Дискриминируемое объединение состояний каталога.
type CatalogState =
    | { status: "idle"; reason: string }
    | { status: "loading"; startedAt: number; progress: number }
    | { status: "success"; products: Product[]; loadedAt: number; source: "cache" | "network" }
    | { status: "empty"; loadedAt: number; searchQuery: string }
    | { status: "error"; message: string; retryable: boolean; errorCode: number };

// Функция для проверки, что все варианты объединения обработаны.
function assertNever(value: never): never {
    throw new Error(`Необработанное состояние: ${value}`);
}

function getStateMessage(state: CatalogState): string {
    switch (state.status) {
        case "idle":
            return `Каталог пока не загружался. Причина: ${state.reason}`;

        case "loading":
            return `Загрузка каталога: ${state.progress}%. Начало: ${new Date(state.startedAt).toLocaleTimeString("ru-RU")}`;

        case "success": {
            const total = state.products.reduce((sum, product) => sum + product.price, 0);
            return `Загружено товаров: ${state.products.length}. Общая стоимость: ${total.toFixed(2)} руб. Источник: ${state.source}`;
        }

        case "empty":
            return `По запросу "${state.searchQuery}" товары не найдены`;

        case "error":
            return `Ошибка ${state.errorCode}: ${state.message}. Повторить попытку: ${state.retryable ? "можно" : "нельзя"}`;

        default:
            return assertNever(state);
    }
}

const products: Product[] = [
    { id: 1, title: "Клавиатура", price: 2490 },
    { id: 2, title: "Мышь", price: 1290 },
    { id: 3, title: "Монитор", price: 15990 }
];

const catalogStates: CatalogState[] = [
    { status: "idle", reason: "первый запуск приложения" },
    { status: "loading", startedAt: Date.now(), progress: 45 },
    { status: "success", products, loadedAt: Date.now(), source: "network" },
    { status: "empty", loadedAt: Date.now(), searchQuery: "планшет" },
    { status: "error", message: "Не удалось получить данные", retryable: true, errorCode: 503 }
];

console.log("=== Состояния каталога ===");
catalogStates.forEach((state) => console.log(getStateMessage(state)));

// Сужение объединения string | number с помощью typeof.
function formatValue(value: string | number): string {
    if (typeof value === "string") {
        return `Строковое значение: ${value.trim().toUpperCase()}`;
    }

    return `Числовое значение: ${value.toFixed(2)}`;
}

console.log("\n=== Проверка typeof ===");
console.log(formatValue("  sku-125  "));
console.log(formatValue(125));

// Сужение объединения объектов через оператор in.
interface Book {
    title: string;
    pages: number;
}

interface VideoCourse {
    title: string;
    durationMinutes: number;
}

type LearningMaterial = Book | VideoCourse;

function describeMaterial(item: LearningMaterial): string {
    if ("pages" in item) {
        return `Книга "${item.title}", страниц: ${item.pages}`;
    }

    return `Видеокурс "${item.title}", длительность: ${item.durationMinutes} минут`;
}

console.log("\n=== Проверка in ===");
console.log(describeMaterial({ title: "TypeScript для начинающих", pages: 320 }));
console.log(describeMaterial({ title: "Основы TypeScript", durationMinutes: 95 }));

// Дополнительное задание: строка или объект параметров поиска.
interface SearchOptions {
    query: string;
    category?: string;
    maxPrice?: number;
}

function searchCatalog(input: string | SearchOptions): string {
    if (typeof input === "string") {
        return `Поиск по строке: "${input}"`;
    }

    const category = input.category ?? "любая категория";
    const maxPrice = input.maxPrice === undefined ? "без ограничения" : `${input.maxPrice} руб.`;
    return `Поиск: "${input.query}", категория: ${category}, максимальная цена: ${maxPrice}`;
}

console.log("\n=== Поиск каталога ===");
console.log(searchCatalog("мышь"));
console.log(searchCatalog({ query: "клавиатура", category: "периферия", maxPrice: 5000 }));

// Дополнительное задание: пользовательский предикат типа.
function isProduct(value: unknown): value is Product {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("id" in value) || !("title" in value) || !("price" in value)) {
        return false;
    }

    return typeof value.id === "number"
        && typeof value.title === "string"
        && typeof value.price === "number";
}

function getProductInfo(value: unknown): string {
    if (isProduct(value)) {
        return `Товар: ${value.title}, цена: ${value.price} руб.`;
    }

    return "Переданное значение не является товаром";
}

console.log("\n=== Пользовательский предикат ===");
console.log(getProductInfo(products[0]));
console.log(getProductInfo({ id: "неверный id", title: "Товар", price: 100 }));

// Дополнительное задание: пересечение типов.
type ProductDetails = Product & {
    category: string;
    featured: boolean;
};

const featuredProduct: ProductDetails = {
    id: 4,
    title: "Игровая клавиатура",
    price: 5990,
    category: "Периферия",
    featured: true
};

console.log("\n=== Пересечение типов ===");
console.log(
    `Дополнительный товар: ${featuredProduct.title}; категория: ${featuredProduct.category}; рекомендуемый: ${featuredProduct.featured}`
);

// Пример различающихся полей состояний:
// idle.reason, loading.progress, success.source, empty.searchQuery, error.errorCode.
// Поле, принадлежащее другому варианту, нельзя использовать без сужения типа.
