const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const reloadButton = document.querySelector("#reload-button");
const statusText = document.querySelector("#status");
const results = document.querySelector("#results");

let currentQuery = "";

async function loadBooks(query) {
    currentQuery = query.trim();

    if (!currentQuery) {
        statusText.textContent = "Введите название книги или автора.";
        statusText.classList.add("error");
        return;
    }

    statusText.textContent = "Загрузка книг...";
    statusText.classList.remove("error");
    results.replaceChildren();
    searchButton.disabled = true;
    reloadButton.disabled = true;

    try {
        const params = new URLSearchParams({
            q: currentQuery,
            limit: "20"
        });

        const response = await fetch("https://openlibrary.org/search.json?" + params);

        if (!response.ok) {
            throw new Error("Ошибка HTTP: " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data.docs)) {
            throw new Error("Сервер вернул данные в неожиданном формате.");
        }

        if (data.docs.length === 0) {
            statusText.textContent = "По этому запросу ничего не найдено.";
            return;
        }

        renderBooks(data.docs);
        statusText.textContent = "Найдено книг: " + data.docs.length;
    } catch (error) {
        statusText.textContent = "Не удалось загрузить данные. Проверьте соединение и попробуйте ещё раз.";
        statusText.classList.add("error");
        console.error("Ошибка загрузки книг:", error);
    } finally {
        searchButton.disabled = false;
        reloadButton.disabled = false;
    }
}

function renderBooks(books) {
    results.replaceChildren();

    books.forEach(book => {
        const card = document.createElement("article");
        card.classList.add("book-card");

        if (book.cover_i) {
            const cover = document.createElement("img");
            cover.classList.add("book-cover");
            cover.src = "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
            cover.alt = "Обложка книги";
            cover.loading = "lazy";
            cover.addEventListener("error", () => {
                const placeholder = document.createElement("div");
                placeholder.classList.add("cover-placeholder");
                placeholder.textContent = "Обложка недоступна";
                cover.replaceWith(placeholder);
            }, { once: true });
            card.append(cover);
        } else {
            const placeholder = document.createElement("div");
            placeholder.classList.add("cover-placeholder");
            placeholder.textContent = "Нет обложки";
            card.append(placeholder);
        }

        const info = document.createElement("div");
        info.classList.add("book-info");

        const title = document.createElement("h3");
        title.textContent = book.title || "Название неизвестно";

        const author = document.createElement("p");
        const authors = Array.isArray(book.author_name) ? book.author_name : [];
        author.textContent = authors.length ? authors.join(", ") : "Автор неизвестен";

        const year = document.createElement("p");
        year.textContent = book.first_publish_year
            ? "Первое издание: " + book.first_publish_year
            : "Год издания неизвестен";

        info.append(title, author, year);

        if (book.key) {
            const link = document.createElement("a");
            link.href = "https://openlibrary.org" + book.key;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Подробнее";
            info.append(link);
        }

        card.append(info);
        results.append(card);
    });
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    loadBooks(searchInput.value);
});

reloadButton.addEventListener("click", () => {
    if (currentQuery) {
        loadBooks(currentQuery);
    }
});