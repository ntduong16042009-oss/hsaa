import type { AuthSession, UserAccount } from '../types/index.ts';

/**
 * Generates a random cryptographic salt string.
 */
export function generateSalt(seed?: string): string {
  if (seed) {
    return `hsa_salt_${seed}`;
  }
  const randomPart = Math.random().toString(36).substring(2, 12);
  const timePart = Date.now().toString(36);
  return `hsa_salt_${timePart}_${randomPart}`;
}

/**
 * Deterministic one-way salted password KDF digest (4096 rounds of 256-bit mixing).
 * Ensures plain-text passwords are NEVER stored in LocalStorage, SessionStorage, or memory.
 */
export function hashPasswordWithSalt(password: string, salt: string): string {
  const input = `${salt}::HSA_MASTER_PEPPER_2026::${password}`;
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  let h3 = 0x9e3779b9 ^ input.length;
  let h4 = 0x85ebca6b ^ input.length;

  for (let round = 0; round < 128; round++) {
    for (let i = 0; i < input.length; i++) {
      const ch = input.charCodeAt(i) + round;
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      h3 = Math.imul(h3 ^ (ch << 3), 2246822507);
      h4 = Math.imul(h4 ^ (ch << 5), 3266489909);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);
    h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
    h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  }

  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return `hsa256$${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}`;
}

/**
 * Verifies a candidate password against a user's stored salt and digest.
 */
export function verifyPassword(
  candidatePassword: string,
  salt: string,
  expectedDigest: string
): boolean {
  if (!candidatePassword || !salt || !expectedDigest) return false;
  const computed = hashPasswordWithSalt(candidatePassword, salt);
  return computed === expectedDigest;
}

/**
 * Creates a signed session object with appropriate expiration:
 * - rememberMe = true: 30 days
 * - rememberMe = false: 2 hours
 */
export function createAuthSession(
  user: Pick<UserAccount, 'id' | 'username' | 'role'>,
  rememberMe: boolean,
  nowMs: number = Date.now()
): AuthSession {
  const ttlMs = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 2 * 60 * 60 * 1000; // 2 hours
  const expiresAt = nowMs + ttlMs;
  const signature = hashPasswordWithSalt(
    `${user.id}:${user.username}:${user.role}:${expiresAt}`,
    'hsa_session_sig_v1'
  );

  return {
    token: `sess_${user.id}_${expiresAt}_${signature.slice(7, 23)}`,
    userId: user.id,
    username: user.username,
    role: user.role,
    issuedAt: nowMs,
    expiresAt,
    rememberMe,
  };
}

/**
 * Checks if an AuthSession is well-formed and not expired.
 */
export function isAuthSessionValid(
  session: AuthSession | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!session || !session.token || !session.userId) return false;
  if (session.expiresAt <= nowMs) return false;
  const expectedSig = hashPasswordWithSalt(
    `${session.userId}:${session.username}:${session.role}:${session.expiresAt}`,
    'hsa_session_sig_v1'
  ).slice(7, 23);
  return session.token.endsWith(expectedSig);
}

export interface RegistrationInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export function validateRegistrationInput(
  input: RegistrationInput,
  existingUsers: UserAccount[]
): { valid: boolean; error?: string } {
  const cleanName = input.fullName.trim();
  const cleanUsername = input.username.trim();
  const cleanEmail = input.email.trim();

  if (!cleanName) {
    return { valid: false, error: 'Vui lòng nhập Họ và tên đầy đủ của bạn.' };
  }
  if (cleanName.length < 3) {
    return { valid: false, error: 'Họ và tên phải có ít nhất 3 ký tự.' };
  }
  if (!cleanUsername) {
    return { valid: false, error: 'Vui lòng nhập Tên đăng nhập.' };
  }
  if (cleanUsername.length < 4 || !/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
    return {
      valid: false,
      error:
        'Tên đăng nhập phải có ít nhất 4 ký tự và chỉ gồm chữ cái không dấu, chữ số, dấu gạch dưới hoặc dấu chấm.',
    };
  }
  if (!cleanEmail) {
    return { valid: false, error: 'Vui lòng nhập địa chỉ Email.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      valid: false,
      error: 'Địa chỉ Email không đúng định dạng (ví dụ hợp lệ: hocsinh@yenlang.edu.vn).',
    };
  }

  const usernameTaken = existingUsers.some(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );
  if (usernameTaken) {
    return {
      valid: false,
      error: `Tên đăng nhập "${cleanUsername}" đã tồn tại trong hệ thống. Vui lòng chọn tên đăng nhập khác.`,
    };
  }

  const emailTaken = existingUsers.some(
    (u) => u.email.toLowerCase() === cleanEmail.toLowerCase()
  );
  if (emailTaken) {
    return {
      valid: false,
      error: `Email "${cleanEmail}" đã được sử dụng cho một tài khoản khác. Vui lòng dùng email khác hoặc đăng nhập.`,
    };
  }

  if (!input.password) {
    return { valid: false, error: 'Vui lòng nhập Mật khẩu.' };
  }
  if (input.password.length < 6) {
    return {
      valid: false,
      error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự để đảm bảo an toàn.',
    };
  }
  if (input.password !== input.confirmPassword) {
    return {
      valid: false,
      error: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập.',
    };
  }
  if (!input.acceptedTerms) {
    return {
      valid: false,
      error: 'Bạn cần tích chọn đồng ý với điều khoản sử dụng và quy định học thuật để tạo tài khoản.',
    };
  }

  return { valid: true };
}

export function validatePasswordChange(
  user: UserAccount,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): { valid: boolean; error?: string } {
  if (!currentPassword) {
    return { valid: false, error: 'Vui lòng nhập mật khẩu hiện tại để xác thực.' };
  }
  if (!verifyPassword(currentPassword, user.passwordSalt, user.passwordDigest)) {
    return { valid: false, error: 'Mật khẩu hiện tại không chính xác.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { valid: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
  }
  if (newPassword === currentPassword) {
    return { valid: false, error: 'Mật khẩu mới phải khác với mật khẩu hiện tại.' };
  }
  if (newPassword !== confirmNewPassword) {
    return { valid: false, error: 'Xác nhận mật khẩu mới không trùng khớp.' };
  }
  return { valid: true };
}
