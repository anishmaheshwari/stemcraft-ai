const PREFIX = "[STEMCraft]";

export function log(
  scope: string,
  message: string,
  data?: Record<string, unknown>
) {
  const entry = data ? `${PREFIX}[${scope}] ${message}` : `${PREFIX}[${scope}] ${message}`;
  if (data) {
    console.log(entry, data);
  } else {
    console.log(entry);
  }
}

export function logWarn(
  scope: string,
  message: string,
  data?: Record<string, unknown>
) {
  if (data) {
    console.warn(`${PREFIX}[${scope}] ${message}`, data);
  } else {
    console.warn(`${PREFIX}[${scope}] ${message}`);
  }
}

export function logError(
  scope: string,
  message: string,
  data?: Record<string, unknown>
) {
  if (data) {
    console.error(`${PREFIX}[${scope}] ${message}`, data);
  } else {
    console.error(`${PREFIX}[${scope}] ${message}`);
  }
}
