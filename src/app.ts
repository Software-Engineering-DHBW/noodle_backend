import * as express from 'express';
import rateLimit from 'express-rate-limit';
import * as crypto from 'crypto';
import router from './routes/index';

const DEV = process.env.NODE_ENV === 'development';

const app = express();
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: true,
});
app.use('/user/login', loginLimiter);
app.use(router);

if (DEV) {
  process.env.jwtSignatureKey = 'Development';
} else {
  process.env.jwtSignatureKey = crypto.randomBytes(64).toString('base64url');
}

export default app;
