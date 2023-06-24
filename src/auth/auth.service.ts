import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    // Verifica che l'utente esista nel database

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    // Verifica che la password sia corretta(NO CRYPTOGRAPHY PER ORA)

    const userPassword = user.password;

    const isPasswordValid = password === userPassword;

    if (!isPasswordValid) {
      throw new HttpException('Password non valida', 401);
    }

    const payload = { email: loginDto.email, ruolo: user.ruolo, id: user._id };
    const token = this.jwtService.sign(payload);

    return token;
  }

  async getProfile(req: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Token mancante', 401);
    }

    const token = authHeader.split(' ')[1];


    if (!token) {
      throw new HttpException('Token mancante', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    if (!decoded) {
      throw new HttpException('Token non valido', 401);
    }

    const userId = decoded['id'];

    const user = await this.userService.findOne(userId);
    delete user.password;

    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    return user;
  }
}
