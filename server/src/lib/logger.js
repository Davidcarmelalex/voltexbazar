function write(level, message, meta = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
    return;
  }

  console.log(line);
}

module.exports = {
  info(message, meta) {
    write('info', message, meta);
  },
  warn(message, meta) {
    write('warn', message, meta);
  },
  error(message, meta) {
    write('error', message, meta);
  },
  child(defaultMeta = {}) {
    return {
      info(message, meta) {
        write('info', message, { ...defaultMeta, ...(meta || {}) });
      },
      warn(message, meta) {
        write('warn', message, { ...defaultMeta, ...(meta || {}) });
      },
      error(message, meta) {
        write('error', message, { ...defaultMeta, ...(meta || {}) });
      },
    };
  },
};
