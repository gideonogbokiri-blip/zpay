const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return acc;
      }

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) {
        return acc;
      }

      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      acc[key] = value;
      return acc;
    }, {});
}

const fileEnv = parseEnvFile(envPath);
const useMock = process.env.EXPO_PUBLIC_USE_MOCK ?? fileEnv.EXPO_PUBLIC_USE_MOCK;
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? fileEnv.EXPO_PUBLIC_API_URL;

const failures = [];

if (useMock !== 'false') {
  failures.push('EXPO_PUBLIC_USE_MOCK must be false for native release builds.');
}

if (!apiUrl) {
  failures.push('EXPO_PUBLIC_API_URL is required for native release builds.');
} else {
  let parsedUrl;
  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    failures.push('EXPO_PUBLIC_API_URL must be a valid absolute URL.');
  }

  if (parsedUrl) {
    if (parsedUrl.protocol !== 'https:') {
      failures.push('EXPO_PUBLIC_API_URL must use HTTPS for native release builds.');
    }

    const unsafeHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', 'backend.vercel.app']);
    if (unsafeHosts.has(parsedUrl.hostname)) {
      failures.push(`EXPO_PUBLIC_API_URL uses unsafe release host: ${parsedUrl.hostname}.`);
    }
  }
}

if (failures.length > 0) {
  console.error('ZPAY release environment check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('ZPAY release environment check passed.');
