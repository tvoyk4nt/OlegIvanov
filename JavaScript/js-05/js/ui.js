export function renderGames(games, list, onStatus, onRemove) {
  list.replaceChildren();

  if (games.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Игры не найдены";
    list.append(empty);
    return;
  }

  games.forEach(game => {
    const item = document.createElement("li");
    item.className = "game";

    const info = document.createElement("div");
    info.className = "game-info";
    const title = document.createElement("strong");
    title.textContent = game.title;
    const details = document.createElement("span");
    details.textContent = game.genre + " · " + game.status;
    info.append(title, details);

    const actions = document.createElement("div");
    actions.className = "game-actions";

    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.textContent = "Следующий статус";
    statusButton.addEventListener("click", () => onStatus(game.id));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Удалить";
    removeButton.addEventListener("click", () => onRemove(game.id));

    actions.append(statusButton, removeButton);
    item.append(info, actions);
    list.append(item);
  });
}