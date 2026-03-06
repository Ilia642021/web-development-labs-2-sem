import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  // algorithms: ['HS256'],  // по умолчанию HS256, можно явно указать
};

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id);

    if (user) {
      // Можно дополнительно проверить, не заблокирован ли пользователь
      if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
        return done(null, false, { message: 'Аккаунт временно заблокирован' });
      }
      return done(null, user);
    }

    return done(null, false, { message: 'Пользователь не найден' });
  } catch (err) {
    return done(err, false);
  }
});

// Регистрируем стратегию
passport.use('jwt', jwtStrategy);

// Для удобства — экспортируем middleware-функцию
export const authenticateJwt = passport.authenticate('jwt', { session: false });

// Если позже захочешь использовать serialize/deserialize (не обязательно для JWT)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
