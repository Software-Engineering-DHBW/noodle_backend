import * as express from 'express';
import rateLimit from 'express-rate-limit';
import * as crypto from 'crypto';
import router from './routes/index';

const PROD = process.env.NODE_ENV === 'production';

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

if (PROD) {
  process.env.jwtSignatureKey = crypto.randomBytes(64).toString('base64url');
} else {
  process.env.jwtSignatureKey = 'Development';
}

export default app;
