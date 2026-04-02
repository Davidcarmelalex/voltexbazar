const { readJsonFile, writeJsonFile } = require('./jsonStore');

class PersistentMap extends Map {
  constructor(fileName, keyName, seedEntries = []) {
    const stored = readJsonFile(fileName, []);
    const entries = Array.isArray(stored) && stored.length ? stored : seedEntries;
    super(entries.map((value) => [value[keyName], value]));
    this.fileName = fileName;
    this.keyName = keyName;

    if (!Array.isArray(stored) || !stored.length) {
      this.persist();
    }
  }

  persist() {
    writeJsonFile(this.fileName, Array.from(this.values()));
  }

  set(key, value) {
    const result = super.set(key, value);
    this.persist();
    return result;
  }

  delete(key) {
    const result = super.delete(key);
    this.persist();
    return result;
  }

  clear() {
    super.clear();
    this.persist();
  }
}

module.exports = { PersistentMap };
