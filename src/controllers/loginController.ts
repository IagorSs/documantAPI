/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import User from './ourUserController';
import auth from '../config/auth';

class Login {
  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async login(req:Request, res:Response) {
    const { username, password } = req.body;
    try {
      const user = await User.find(username);
      console.log(user);
      if (user.message !== null) {
        return res.status(404).json({ error: 'user not found' });
      }
      const match = await bcrypt.compare(password, user.Item.password);
      if (!match) {
        return res.status(401).json({ error: 'wrong password' });
      }
      const userForToken = {
        username,
        id: 0, /* algum id q a gente tem q definir pra cada user
        (caso ache desnecessário, só tirar a chave id do json) */
      };
      const accessToken = jwt.sign(userForToken, auth.secret, { expiresIn: auth.expire });
      return res.json({ accessToken });
    } catch (error) {
      return res.json({ error1: error.message });
    }
  }

  static async logout(req:Request, res:Response) {
    /* aqui a gente precisa só excluir o refreshToken de onde ele estiver armazenado */
  }
}

export default Login;
