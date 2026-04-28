import crypto from 'node:crypto';

const usersByEmail = new Map();

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, storedKey] = passwordHash.split(':');

  if (!salt || !storedKey) {
    return false;
  }

  const incomingKey = crypto.scryptSync(password, salt, 64).toString('hex');

  return crypto.timingSafeEqual(
    Buffer.from(incomingKey, 'hex'),
    Buffer.from(storedKey, 'hex')
  );
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

class AuthService {
  createUser({ name, email, password }) {
    const normalizedEmail = email.toLowerCase();

    if (usersByEmail.has(normalizedEmail)) {
      const error = new Error('Email is already registered');
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      passwordHash: createPasswordHash(password),
      role: usersByEmail.size === 0 ? 'admin' : 'volunteer',
      createdAt: new Date().toISOString()
    };

    usersByEmail.set(normalizedEmail, user);
    return toPublicUser(user);
  }

  authenticateUser({ email, password }) {
    const normalizedEmail = email.toLowerCase();
    const user = usersByEmail.get(normalizedEmail);

    if (!user) {
      return null;
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return null;
    }

    return toPublicUser(user);
  }
}

const authService = new AuthService();

export function getAuthService() {
  return authService;
}

export default getAuthService;
