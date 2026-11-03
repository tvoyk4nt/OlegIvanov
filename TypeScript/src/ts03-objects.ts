type ProductId = number;

interface SupplierContact {
    email?: string;
    phone?: string;
}

interface Supplier {
    name: string;
    country: string;
    contact?: SupplierContact;
}

interface Product {
    readonly id: ProductId;
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
    tags: string[];
    supplier: Supplier;
    description?: string;
}

const products: Product[] = [
    {
        id: 1,
        name: "Беспроводная мышь",
        category: "Периферия",
        price: 1490,
        isAvailable: true,
        tags: ["мышь", "беспроводная"],
        supplier: {
            name: "InputPro",
            country: "Германия",
            contact: { email: "info@inputpro.example" }
        },
        description: "Мышь для повседневной работы"
    },
    {
        id: 2,
        name: "Механическая клавиатура",
        category: "Периферия",
        price: 4990,
        isAvailable: true,
        tags: ["клавиатура", "механическая"],
        supplier: {
            name: "KeyLine",
            country: "Китай",
            contact: { phone: "+7 900 111-22-33" }
        }
    },
    {
        id: 3,
        name: "Монитор 27 дюймов",
        category: "Мониторы",
        price: 15990,
        isAvailable: false,
        tags: ["монитор", "27 дюймов"],
        supplier: {
            name: "ViewTech",
            country: "Польша"
        },
        description: "Монитор с IPS-матрицей"
    },
    {
        id: 4,
        name: "Наушники",
        category: "Аудио",
        price: 3290,
        isAvailable: true,
        tags: ["наушники", "звук"],
        supplier: {
            name: "SoundWay",
            country: "Япония",
            contact: {
                email: "support@soundway.example",
                phone: "+7 900 222-33-44"
            }
        }
    },
    {
        id: 5,
        name: "Веб-камера",
        category: "Аксессуары",
        price: 2790,
        isAvailable: false,
        tags: ["камера", "видео"],
        supplier: {
            name: "WebOptic",
            country: "Китай"
        },
        description: "Камера для видеосвязи"
    },
    {
        id: 6,
        name: "USB-хаб",
        category: "Аксессуары",
        price: 890,
        isAvailable: true,
        tags: ["USB", "переходник"],
        supplier: {
            name: "ConnectPlus",
            country: "Россия",
            contact: { email: "help@connectplus.example" }
        }
    }
];

// Получаем товары, которые сейчас есть в наличии.
const availableProducts: Product[] = products.filter(product => product.isAvailable);
console.log("Товары в наличии:", availableProducts);

// Получаем только названия товаров. Тип результата — string[].
const productNames: string[] = products.map(product => product.name);
console.log("Названия товаров:", productNames);

// Ищем товар по идентификатору. Результат может быть undefined.
const foundProduct = products.find(product => product.id === 3);

if (foundProduct !== undefined) {
    console.log("Найден товар:", foundProduct.name);
} else {
    console.log("Товар с таким ID не найден");
}

// Менять обычные свойства можно, а id объявлен только для чтения.
products[0].price = 1390;
products[0].isAvailable = false;
// @ts-expect-error Идентификатор нельзя изменить.
products[0].id = 10;

// Описание выводится только в том случае, если оно есть.
products.forEach(product => {
    if (product.description !== undefined) {
        console.log(product.name + ": " + product.description);
    }
});

// Контактные данные и email могут отсутствовать.
products.forEach(product => {
    const contact = product.supplier.contact;

    if (contact !== undefined && contact.email !== undefined) {
        console.log("Почта поставщика " + product.supplier.name + ": " + contact.email);
    } else {
        console.log("Контактная почта поставщика " + product.supplier.name + " не указана");
    }
});

// Цифровой товар использует общие поля Product и добавляет свои.
interface DigitalProduct extends Product {
    downloadUrl: string;
    fileSizeMb: number;
}

const digitalProduct: DigitalProduct = {
    id: 7,
    name: "Курс по TypeScript",
    category: "Обучение",
    price: 1200,
    isAvailable: true,
    tags: ["курс", "typescript"],
    supplier: {
        name: "CodeSchool",
        country: "Россия"
    },
    downloadUrl: "/files/typescript-course.zip",
    fileSizeMb: 350
};

console.log("Цифровой товар:", digitalProduct);

// Структурная типизация: дополнительные поля не мешают присваиванию
// уже созданного объекта более узкому типу.
interface ProductCard {
    name: string;
    price: number;
}

const productWithComment = {
    name: "Коврик для мыши",
    price: 650,
    comment: "Большой размер"
};

const productCard: ProductCard = productWithComment;
console.log("Карточка товара:", productCard);

// При прямом присваивании литерала лишнее поле отмечается ошибкой.
// @ts-expect-error Поле comment не описано в ProductCard.
const wrongProductCard: ProductCard = {
    name: "Коврик для мыши",
    price: 650,
    comment: "Большой размер"
};

// Supplier повторно используется в другой модели без копирования полей.
interface Delivery {
    id: number;
    supplier: Supplier;
    address: string;
    status: string;
}

const delivery: Delivery = {
    id: 1,
    supplier: products[0].supplier,
    address: "Сыктывкар, ул. Ленина, 10",
    status: "В пути"
};

console.log("Поставка:", delivery);
