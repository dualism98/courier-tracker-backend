import { Router } from "express";
import multer from 'multer';
import fs from 'fs/promises';

import User from "../models/User";
import path from "path";

const authRouter = Router();
const upload = multer({ dest: path.join(__dirname, '../temp/') });

// /api/auth/
authRouter.post(
    '/', 
    upload.single('avatar'),
    async (req, res) => {
    try {
        const user = new User({name: req.body.name});
    
        const tempPath = req.file?.path;
        const targetPath = path.join(__dirname, `../static/${user.id}.png`)

        await fs.rename(tempPath!, targetPath);
        user.set('avatar', `http://localhost:${process.env.PORT || 8080}/static/${user.id}.png`)

        await user.save();

        res.send({userId: user.id});
    } catch (err) {
        console.log('Err', err)
        res.status(500).send(err)
    }
})


// /api/auth/signin
// authRouter.get('/',
//     async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()){
//             return res.status(400).json({message: errors.array()[0].msg});
//         }
//         const {login, password} = req.body;
//         console.log('login', login, 'password', password)
//         const user = await User.findOne({ login });
//         if (!user) {
//             return res.status(400).json({message: 'Неверный логин или пароль'})
//         }

//         const passwordIsMatch = await bcrypt.compare(password, user.password);

//         if (!passwordIsMatch){
//             return res.status(400).json({message: 'Неверный логин или пароль'})
//         }

//         const token = jwt.sign({userId: user.id}, config.get('secretKeyJWT'), {expiresIn: '9999h'})

//         res.json({token, login: user.login, name: user.name});
//     } catch (err) {
//         res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
//     }
// });

export default authRouter;
