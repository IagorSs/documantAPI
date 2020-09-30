/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import User from './ourUserController_old';
import auth from '../config/auth';
import TokenController from './tokenController_old';

class Login {
  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async login(req:Request, res:Response) {
    const { email, password } = req.body;
    try {
      const user = await User.find(email);
      if (user.message !== undefined) {
        return res.status(404).json({ error: user.message });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'senha incorreta' });
      }
      const userForToken = {
        username: email,
        id: 0, /* algum id q a gente tem q definir pra cada user
        (caso ache desnecessário, só tirar a chave id do json) */
      };
      const accessToken = jwt.sign(userForToken, auth.secret, { expiresIn: auth.expire });
      const refreshToken = jwt.sign(userForToken, auth.refreshSecret);
      const insert = await TokenController.insertToken(refreshToken);
      if (insert.message !== null) {
        return res.status(500).json({ error: `ocorreu um erro - ${insert.message}` });
      }
      return res.json({ accessToken, refreshToken });
    } catch (error) {
      return res.json({ error1: `Ocorreu um erro inesperado - ${error.message}` });
    }
  }

  static async logout(req:Request, res:Response) {
    // eslint-disable-next-line max-len
    // const { token } = req.headers.authorization; // não me lembro de como resolver esse errinho aqui
    const { token } = req.body;
    if (!token) {
      // eslint-disable-next-line quotes
      return res.status(400).json({ error: `token can't be null` });
    }
    const del = await TokenController.deleteToken(token);
    if (del.message !== undefined) {
      return res.status(500).json({ error: `erro ao fazer logout - ${del.message}` });
    }
    return res.status(200).json({});
  }
}

export default Login;
