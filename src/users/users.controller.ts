import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  @Inject('CUSTOM_DATA') private readonly name: string;

  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    console.log(this.name);
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  // @Get('whoami')
  // whoAmI(@Session() session: any) {
  //   return this.userService.getUserById(session.userId);
  // }

  @UseGuards(AuthGuard)
  @Get('whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.singup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, body);
  }
}
