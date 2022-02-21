import * as express from 'express';
import rateLimit from 'express-rate-limit';
import router from './routes/index';

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

export default app;
