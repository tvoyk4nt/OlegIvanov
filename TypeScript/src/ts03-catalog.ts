type TS03ProductId = number;

interface TS03SupplierContact {
    email?: string;
    phone?: string;
}

interface TS03Supplier {
    name: string;
    country: string;
    contact?: TS03SupplierContact;
}

interface TS03Product {
    readonly id: TS03ProductId;
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
    tags: string[];
    supplier: TS03Supplier;
    description?: string;
}

const ts03Products: TS03Product[] = [
    {
        id: 1,
        name: "Беспроводная мышь",
        category: "Периферия",
        price: 1490,
        isAvailable: true,
        tags: ["мышь", "беспроводная"],
        supplier: {
            name: "TechLine",
            country: "Китай",
            contact: { email: "sales@techline.example" }
        },
        description: "Мышь с USB-приёмником"
    },
    {
        id: 2,
        name: "Механическая клавиатура",
        category: "Периферия",
        price: 4990,
        isAvailable: true,
        tags: ["клавиатура", "механическая"],
        supplier: {
            name: "KeyPro",
            country: "Германия",
            contact: { phone: "+49 30 123456" }
        }
    },
    {
        id: 3,
        name: "Монитор 24 дюйма",
        category: "Мониторы",
        price: 12990,
        isAvailable: false,
        tags: ["монитор", "Full HD"],
        supplier: {
            name: "ViewTech",
            country: "Польша"
        },
        description: "Монитор для работы и учёбы"
    },
    {
        id: 4,
        name: "Наушники",
        category: "Аудио",
        price: 3290,
        isAvailable: true,
        tags: ["наушники", "звук"],
        supplier: {
            name: "SoundLab",
            country: "Япония",
            contact: {
                email: "info@soundlab.example",
                phone: "+81 3 1234 5678"
            }
        }
    },
    {
        id: 5,
        name: "Веб-камера",
        category: "Аксессуары",
        price: 2790,
        isAvailable: false,
        tags: ["камера", "USB"],
        supplier: {
            name: "TechLine",
            country: "Китай"
        },
        description: "Камера для видеосвязи"
    },
    {
        id: 6,
        name: "USB-концентратор",
        category: "Аксессуары",
        price: 890,
        isAvailable: true,
        tags: ["USB", "адаптер"],
        supplier: {
            name: "InputPro",
            country: "Германия",
            contact: { email: "help@inputpro.example" }
        }
    }
];

// Получаем товары, которые сейчас есть в наличии.
const ts03AvailableProducts: TS03Product[] = ts03Products.filter(
    product => product.isAvailable
);
console.log("Доступные товары:", ts03AvailableProducts);

// Получаем названия товаров.
const ts03ProductNames: string[] = ts03Products.map(product => product.name);
console.log("Названия товаров:", ts03ProductNames);

// Ищем товар по идентификатору. Результат может быть undefined.
const ts03FoundProduct = ts03Products.find(product => product.id === 3);

if (ts03FoundProduct !== undefined) {
    console.log("Найден товар:", ts03FoundProduct.name);
} else {
    console.log("Товар с таким идентификатором не найден");
}

// Менять можно обычные свойства, но не id.
const ts03FirstProduct = ts03Products[0];
ts03FirstProduct.price = 1390;
ts03FirstProduct.isAvailable = true;
ts03FirstProduct.tags.push("популярный");
// ts03FirstProduct.id = 10; // Ошибка: id объявлен как readonly

// Описание выводится только в том случае, если оно задано.
ts03Products.forEach(product => {
    if (product.description !== undefined) {
        console.log(product.name + ": " + product.description);
    }
});

// Проверяем вложенные контактные данные поставщика.
ts03Products.forEach(product => {
    const contact = product.supplier.contact;

    if (contact !== undefined) {
        if (contact.email !== undefined) {
            console.log(product.supplier.name + ": " + contact.email);
        }
    } else {
        console.log("Контакты поставщика " + product.supplier.name + " не указаны");
    }
});

// Цифровой товар использует общие поля Product и добавляет свои.
interface TS03DigitalProduct extends TS03Product {
    downloadUrl: string;
    fileSizeMb: number;
}

const ts03Ebook: TS03DigitalProduct = {
    id: 7,
    name: "Книга по TypeScript",
    category: "Электронные книги",
    price: 990,
    isAvailable: true,
    tags: ["книга", "TypeScript"],
    supplier: {
        name: "CodeBooks",
        country: "Россия",
        contact: { email: "books@example.ru" }
    },
    downloadUrl: "/files/typescript-book.pdf",
    fileSizeMb: 12
};

console.log("Цифровой товар:", ts03Ebook);

// Структурная типизация: дополнительные поля уже созданного объекта
// не мешают присвоить его переменной с более узкой структурой.
const ts03SupplierWithRegion = {
    name: "NorthTech",
    country: "Россия",
    region: "Северо-Запад"
};

const ts03ShortSupplier: TS03Supplier = ts03SupplierWithRegion;
console.log("Поставщик:", ts03ShortSupplier.name);

// При прямом присваивании литерала лишнее поле проверяется отдельно.
const ts03SupplierLiteral: TS03Supplier = {
    name: "LocalStore",
    country: "Россия",
    // @ts-expect-error Лишнее поле при прямом присваивании литерала
    region: "Коми"
};
console.log("Ещё один поставщик:", ts03SupplierLiteral.name);

// Эта модель тоже использует TS03Supplier, поэтому структура контактов
// поставщика не описывается повторно.
interface TS03PurchaseRequest {
    requestNumber: number;
    supplier: TS03Supplier;
    productNames: string[];
}

const ts03Request: TS03PurchaseRequest = {
    requestNumber: 1001,
    supplier: ts03Products[0].supplier,
    productNames: ["Беспроводная мышь", "USB-концентратор"]
};

console.log("Заявка поставщику:", ts03Request);
