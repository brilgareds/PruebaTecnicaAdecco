import { Router } from "express";
import { login, loginPage, logout } from '../controllers/auth.controller';

const router = Router();

router.get('/', loginPage);
router.post('/logout', logout);
router.post('/login', login);

export default router;