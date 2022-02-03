import { Request } from "express";
import { Strategy, StrategyOptions } from "passport-jwt";
import config from "../config/config";
import User from "../models/User";

const cookieExtractor = (req:Request) => req?.cookies?.['token'] || '';

const opts: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwtSecret
};

export default new Strategy(opts, async (payload, done) => {
    try {
        const user = await User.findById(payload.id)
    
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (e) {
        console.log(e);
    }
})