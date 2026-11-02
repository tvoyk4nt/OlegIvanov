export class Game {
  constructor(title, genre, status = "В планах", id = Date.now()) {
    this.title = title;
    this.genre = genre;
    this.status = status;
    this.id = id;
  }

  changeStatus(status) {
    const allowed = ["В планах", "Играю", "Пройдена"];
    if (!allowed.includes(status)) {
      throw new Error("Неизвестный статус");
    }
    this.status = status;
  }
}

export class GameCollection {
  constructor(games = []) {
    this.games = games;
  }

  add(game) {
    if (this.games.some(item => item.title.toLowerCase() === game.title.toLowerCase())) {
      throw new Error("Такая игра уже есть в коллекции");
    }
    this.games.push(game);
  }

  remove(id) {
    this.games = this.games.filter(game => game.id !== id);
  }

  findByTitle(text) {
    return this.games.filter(game => game.title.toLowerCase().includes(text.toLowerCase()));
  }

  getByStatus(status) {
    return status === "all" ? [...this.games] : this.games.filter(game => game.status === status);
  }
}