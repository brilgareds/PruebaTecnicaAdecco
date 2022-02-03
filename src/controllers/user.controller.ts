import { Request, Response } from "express";
import User from "../models/User";
import passport from 'passport';

export const UserListPage = async (req:Request, res:Response) => {

    const users:any = JSON.parse(JSON.stringify(await User.find({}, { _id:0 })));
    const backend = `${req.protocol}://${req.get('host')}`;

    res.render('users', { users, backend });
};

export const CreateUserPage = async (req:Request, res:Response) => {
    res.render('createUser');
};

export const UserDetailsPage = async (req:Request, res:Response) => {
    const username = req.params.id;

    const user = JSON.parse(JSON.stringify(await User.findOne({username}, { _id:0, password:0 })));

    console.log('username: ', username);
    console.log('User: ', user);

    res.render('userDetailsPage', { user });
};

const validCreateUserFields = (params:any) => {
    return (
        (params.name     !== '' && params.name     !== undefined) &&
        (params.lastname !== '' && params.lastname !== undefined) &&
        (params.email    !== '' && params.email    !== undefined) &&
        (params.username !== '' && params.username !== undefined) &&
        (params.password !== '' && params.password !== undefined)
    )
};

export const CreateUser = async (req:Request, res:Response) => {

    const params = {
        name: req.body.name,
        lastname: req.body.lastName,
        email: req.body.email,
        username: req.body.userName,
        password: req.body.password
    };

    try {

        const validFields = validCreateUserFields(params);
        const emailExist    = await User.findOne({email: params.email});
        const usernameExist = await User.findOne({username: params.username});
    
        if (!validFields)  throw { status: 400, msg: 'Campos invalidos' };
        if (emailExist)    throw { status: 400, msg: 'Correo ya existe' };
        if (usernameExist) throw { status: 400, msg: 'Username ya existe' };
    
        const newUser = new User(params);
        await newUser.save();
    
        const status = 201;
        const msg = 'Usuario creado satisfactoriamente';

        res.status(status).json({msg, status})
    } catch (e:any) {
        const status = e.status || 500;
        const msg = e.msg || e.toString() || 'Error no controlado';

        res.status(status).json({msg, status});
    }

};

export const DeleteUser = async (req:Request, res:Response) => {

    try {

        const username = req?.body?.username;
    
        if (!username) throw { status: 400, msg: 'Debe enviar el username' }

        const deleted = (await User.deleteOne({ username })).deletedCount;

        if (!deleted) throw { status: 500, msg: 'Eliminación del usuario fallo' }

        const status = 200;
        const msg = 'Usuario eliminado satisfactoriamente';

        res.status(status).json({msg, status})
    } catch (e:any) {
        const status = e.status || 500;
        const msg = e.msg || e.toString() || 'Error no controlado';

        res.status(status).json({msg, status});
    }
};