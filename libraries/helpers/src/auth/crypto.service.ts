import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';

export class CryptoService {
  /**
   * The function generates a hashed password using bcrypt with a secret pepper added to the input
   * password.
   * @param {string} password - The `generatehashPassword` function takes a `password` parameter of type
   * string. This password is used to generate a hashed password using bcryptjs with a salt and secret
   * pepper.
   * @returns The function `generatehashPassword` returns the hashed password generated using bcryptjs
   * after combining the input password with a secret pepper and hashing it with a generated salt.
   */
  static async generatehashPassword(password: string) {
    const saltRounds = 12;
    const salt = await bcryptjs.genSalt(saltRounds);

    const valueWithSecret = (password +
      process.env.BCRYPT_SECRET_PEPPER) as string;

    const hashed = await bcryptjs.hashSync(valueWithSecret, salt);
    return hashed;
  }

  /**
   * The function `comparePassword` compares a given password with a hashed value using bcryptjs with a
   * secret pepper added to the password.
   * @param {string} password - The `password` parameter is a string that represents the user's input
   * password that needs to be compared with a hashed password.
   * @param {string} hash - The `hash` parameter in the `comparePassword` function is typically a hashed
   * password stored in a database or any other storage. When a user tries to log in, their input
   * password is hashed and compared with this stored hash to verify the password.
   * @returns The `comparePassword` function is returning a boolean value indicating whether the provided
   * password matches the hashed value after being combined with the secret pepper and compared using
   * bcryptjs.
   */
  static async comparePassword(password: string, hash: string) {
    const valueWithSecret = (password +
      process.env.BCRYPT_SECRET_PEPPER) as string;
    const isValid = await bcryptjs.compareSync(valueWithSecret, hash);
    return isValid;
  }

  /**
   * The function generates an access token using a payload and specified options.
   * @param payload - The `payload` parameter in the `generateAccessToken` function is an object that
   * contains the `user_id` property as a string. This payload is used to generate a JSON Web Token (JWT)
   * access token with specific options such as algorithm, expiration time, issuer, audience, and
   * subject.
   * @returns The `generateAccessToken` function returns an access token generated using the `jwt.sign`
   * method with the provided payload, access token secret, and options.
   */
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

  /**
   * The function `generateRefreshToken` generates a refresh token using a payload and specific options.
   * @param payload - The `payload` parameter is an object that contains the `user_id` property, which is
   * a string.
   * @returns The `generateRefreshToken` function is returning a refresh token that is generated using
   * the `jwt.sign` method from the `jsonwebtoken` library. The refresh token is signed using the
   * `JWT_REFRESH_TOKEN_SECRET` environment variable as the secret key and includes the specified
   * payload, options, and algorithm 'HS256'. The refresh token has an expiration time set by the
   * `JWT_REFRESH_TOKEN_EXPIRATION` environment
   */
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

  /**
   * The function `verifyAccessToken` verifies the validity of a given access token using a specified
   * algorithm and issuer.
   * @param {string} token - The `token` parameter is a string that represents the access token that
   * needs to be verified. This function uses the `jsonwebtoken` library to verify the access token
   * using the specified options and secret key.
   * @returns The `decoded` object is being returned after verifying the access token using the
   * `jwt.verify` method with the specified options and secret key.
   */
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

  /**
   * The function `verifyRefreshToken` verifies a JWT refresh token using a specified algorithm and
   * issuer.
   * @param {string} token - The `token` parameter is a string that represents a refresh token used for
   * authentication in a Forex Trading System.
   * @returns The `decoded` object containing the decoded information from the refresh token is being
   * returned.
   */
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
