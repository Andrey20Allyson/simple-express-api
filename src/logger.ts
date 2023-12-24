export function createLogger() {
  function log(label: string, ...args: any[]) {
    console.log(`[${label}]:`, ...args);
  }

  return {
    log,
  };
}

export const logger = createLogger();
