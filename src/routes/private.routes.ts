import { Request, Response, Router } from "express";
import passport from "passport";
import { UserListPage, CreateUserPage, CreateUser, UserDetailsPage, DeleteUser } from "../controllers/user.controller";

const router = Router();

router.get('/userList', passport.authenticate('jwt', { session: false }), UserListPage);
router.get('/user/:id', passport.authenticate('jwt', { session: false }), UserDetailsPage)
router.get('/createUser',    passport.authenticate('jwt', { session: false }), CreateUserPage);
router.post('/createUser',   passport.authenticate('jwt', { session: false }), CreateUser);
router.delete('/deleteUser', passport.authenticate('jwt', { session: false }), DeleteUser)

export default router;