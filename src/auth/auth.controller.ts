import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { token };
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    const profile = await this.authService.getProfile(req);
    return profile;
  }
}
