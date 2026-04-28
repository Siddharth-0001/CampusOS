import jwt from 'jsonwebtoken';

const DEV_FALLBACK_SECRET = 'campus-os-dev-jwt-secret-change-me';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }

  console.warn('JWT_SECRET is not set. Using development fallback secret.');
  return DEV_FALLBACK_SECRET;
}

export function registerJwtAuthenticator(registry) {
  const secret = getJwtSecret();
  const defaultExpiresIn = process.env.JWT_EXPIRES_IN || '15m';

  const jwtAuthenticator = {
    sign(payload, options = {}) {
      return jwt.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn: options.expiresIn || defaultExpiresIn
      });
    },
    verify(token) {
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    }
  };

  registry.registerAuthenticator('jwt', jwtAuthenticator);
  return jwtAuthenticator;
}

export default registerJwtAuthenticator;
