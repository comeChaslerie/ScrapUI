/**
 * `localStorage` n'est pas disponible dans l'environnement de test
 * (jsdom sans origine exploitable). On en installe un en mémoire sur la
 * fenêtre le temps du test — c'est exactement ce que lit ScrapTheme.
 */
export function installFakeStorage(): Storage {
  const map = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => void map.delete(key),
    setItem: (key, value) => void map.set(key, String(value)),
  };
  defineStorage(storage);
  return storage;
}

/** Simule un environnement sans stockage du tout. */
export function removeStorage(): void {
  defineStorage(undefined);
}

function defineStorage(value: Storage | undefined): void {
  Object.defineProperty(document.defaultView!, 'localStorage', {
    value,
    configurable: true,
    writable: true,
  });
}
