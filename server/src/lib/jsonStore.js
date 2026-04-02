const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function ensureFile(filePath, defaultValue) {
  ensureDataDir();

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

function readJsonFile(fileName, defaultValue) {
  const filePath = path.join(dataDir, fileName);
  ensureFile(filePath, defaultValue);

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function writeJsonFile(fileName, value) {
  const filePath = path.join(dataDir, fileName);
  ensureFile(filePath, value);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

module.exports = {
  dataDir,
  ensureDataDir,
  readJsonFile,
  writeJsonFile,
};
