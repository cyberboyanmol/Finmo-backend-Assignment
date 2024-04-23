import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';

export class CryptoService {
  static async generatehashPassword(password: string) {
    const saltRounds = 12;
    const salt = await bcryptjs.genSalt(saltRounds);

    const valueWithSecret = (password +
      process.env.BCRYPT_SECRET_PEPPER) as string;

    const hashed = await bcryptjs.hashSync(valueWithSecret, salt);
    return hashed;
  }

  static async comparePassword(password: string, hash: string) {
    const valueWithSecret = (password +
      process.env.BCRYPT_SECRET_PEPPER) as string;
    const isValid = await bcryptjs.compareSync(valueWithSecret, hash);
    return isValid;
  }

  static generateAccessToken(payload: { user_id: string }) {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
      issuer: 'Forex-Trading-System',
      audience: `user_${payload.user_id}`,
      subject: 'accessToken',
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      options
    );
    return accessToken;
  }

  static generateRefreshToken(payload: { user_id: string }) {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,
      issuer: 'Forex-Trading-System',
      audience: `user_${payload.user_id}`,
      subject: 'refreshToken',
    };

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      options
    );
    return refreshToken;
  }

  static verifyAccessToken(token: string) {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      issuer: 'Forex-Trading-System',
    };

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      options
    );
    return decoded;
  }

  static verifyRefreshToken(token: string) {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      issuer: 'Forex-Trading-System',
    };

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      options
    );
    return decoded;
  }
}
