const productName: string = "Wireless mouse";
let unitPrice: number = 2500;
let quantity: number = 3;
let discountPercent: number = 10;

function calculateOrder(): void {
    const priceInput = document.querySelector<HTMLInputElement>("#unit-price");
    const quantityInput = document.querySelector<HTMLInputElement>("#quantity");
    const discountInput = document.querySelector<HTMLInputElement>("#discount");
    const result = document.querySelector<HTMLElement>("#result");
    const message = document.querySelector<HTMLElement>("#message");

    if (priceInput === null || quantityInput === null || discountInput === null ||
        result === null || message === null) {
        return;
    }

    unitPrice = Number(priceInput.value);
    quantity = Number(quantityInput.value);
    discountPercent = Number(discountInput.value);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        message.textContent = "Цена должна быть неотрицательным числом.";
        result.textContent = "";
        return;
    }

    if (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
        message.textContent = "Количество должно быть целым числом не меньше 1.";
        result.textContent = "";
        return;
    }

    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        message.textContent = "Скидка должна быть от 0 до 100 процентов.";
        result.textContent = "";
        return;
    }

    const total = unitPrice * quantity;
    const discountedTotal = total * (1 - discountPercent / 100);

    message.textContent = "";
    result.textContent = `${productName}: ${discountedTotal.toFixed(2)} руб. (до скидки: ${total.toFixed(2)} руб.)`;
    console.log(`${productName}: ${discountedTotal.toFixed(2)} руб.`);
}

const calculateButton = document.querySelector<HTMLButtonElement>("#calculate");
if (calculateButton !== null) {
    calculateButton.addEventListener("click", calculateOrder);
}

calculateOrder();
