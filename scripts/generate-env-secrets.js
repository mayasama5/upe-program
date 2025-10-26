const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../backend-nodejs/.env');

function generateSecret(length = 64) {
  return require('crypto').randomBytes(length / 2).toString('hex');
}

const secrets = {
  SESSION_SECRET: generateSecret(64),
  JWT_SECRET: generateSecret(64),
  ENCRYPTION_KEY: generateSecret(64)
};

function updateEnvFile(filePath, secretsObj) {
  let env = fs.readFileSync(filePath, 'utf8');
  Object.entries(secretsObj).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (env.match(regex)) {
      env = env.replace(regex, `${key}=${value}`);
    } else {
      env += `\n${key}=${value}`;
    }
  });
  fs.writeFileSync(filePath, env, 'utf8');
  console.log('Secrets updated in .env:');
  Object.entries(secretsObj).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
}

updateEnvFile(envPath, secrets);
