const KEY = "safe-notes";

export function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(note =>
      note && typeof note.id === "number" &&
      typeof note.title === "string" && note.title.length <= 60 &&
      typeof note.text === "string" && note.text.length <= 500
    );
  } catch {
    return [];
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}