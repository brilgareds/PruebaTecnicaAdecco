import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';
import { IUser } from '../models/User';
import jwt from "jsonwebtoken";
import config from '../config/config';


const createToken = (user: any) => {
    return jwt.sign({ id:user.id, email:user.email }, config.jwtSecret, {
        expiresIn: 86400
    })
};

export const loginPage = (req:Request, res: Response) => res.render('login');

export const login = async (req:Request, res: Response) => {

    try {
        const params = {
            username: req.body?.username || '',
            password: req.body?.password || ''
        };
    
        if (!params.username || !params.password) throw { status: 400, msg: 'Debe enviar el username y la clave' }
    
        const user = await User.findOne({username: params.username});
        const passwordValid = await user?.comparePassword(params.password);
    
        if (!user || !passwordValid) throw { status: 400, msg: 'Usuario o clave incorreta' }

        const token = createToken(user);

        res.cookie('token', token);
        res.status(200).json({ status: 200, msg: 'Sesion iniciada correctamente', token });
    } catch (e:any) {
        res.status(e.status || 500).json(e);
    }
}

export const logout = async (req:Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).send({status: 200, msg: 'Sesion cerrada correctamente'})
};