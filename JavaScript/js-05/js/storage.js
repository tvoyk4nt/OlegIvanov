const STORAGE_KEY = "game-collection";

export function loadGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(game =>
      game && typeof game.title === "string" &&
      typeof game.genre === "string" &&
      ["В планах", "Играю", "Пройдена"].includes(game.status) &&
      Number.isFinite(game.id)
    );
  } catch {
    return [];
  }
}

export function saveGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}