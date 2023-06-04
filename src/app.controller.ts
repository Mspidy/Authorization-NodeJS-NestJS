import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';


@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService, private jwtService: JwtService) { }

  @Post('register')
  async register(@Body() data: { name: string, email: string, password: string }): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    const user = {
      name: data.name,
      email: data.email,
      password: hashedPassword
    };
    return this.appService.register(user);
  }

  @Post('login')
  async login(@Body() data: { email: string, password: string }, @Res({ passthrough: true }) response: Response) {
    const user = await this.appService.findOne(data.email);
    if (!user) {
      throw new BadRequestException('invalid credentials')
    }

    if (!await bcrypt.compare(data.password, user.password)) {
      throw new BadRequestException('invalid credentials')
    }

    const jwt = await this.jwtService.signAsync({ id: user.id })
    response.cookie('jwt', jwt, { httpOnly: true })

    return {
      message: `Success, ${jwt}`
    };
  }

  @Get('user')
  async getUser(@Req() request: any) {
    const jwtCookieObject = request.cookies;
    console.log("jwtCookieObject", Object.keys(jwtCookieObject))

    if (!jwtCookieObject) {
      throw new UnauthorizedException('JWT cookie is missing');
    }

    const jwtToken = Object.keys(jwtCookieObject)[0];
    console.log("json token", jwtToken)
    try {
      const decodedToken = await this.jwtService.verifyAsync(jwtToken);
      console.log(decodedToken)
      if (!decodedToken) {
        throw new UnauthorizedException();
      }

      const userId = decodedToken.id;
      const user = await this.appService.findById(userId);
      console.log(user)
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT');
    }
  }

  @Get('user/info')
  async user(@Req() request: Request) {
    try {
      const jwtCookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(jwtCookie)
      if (!data) {
        throw new UnauthorizedException();
      }
      console.log(data['id'])
      const user = await this.appService.findOneUser(data['id'])
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success'
    }
  }


  //------------------now for all controller for Todo List
  @Post('todo-post')
  create(@Body() createBrandDto: any) {
    return this.appService.create(createBrandDto);
  }
 
  @Get('todo-get')
  async findAll() {
    return await this.appService.findAll();
  }

  @Patch('todo/:id')
  update(@Param('id') id: string, @Body() updateBrandDto: any) {
    return this.appService.update(+id, updateBrandDto);
  }

  @Delete('todo/:id')
  remove(@Param('id') id: string) {
    return this.appService.remove(+id);
  }

}
