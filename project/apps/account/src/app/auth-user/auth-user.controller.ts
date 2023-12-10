import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UserRdo } from './rdo/user.rdo';
import { CreateUserDto } from './dto/create-user.dto';
import { fillDto } from '@project/shared/helpers';
import { LoginUserDto } from './dto/login-user.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth-user')
export class AuthUserController {
  constructor(
    private readonly authService: AuthUserService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New user created'
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password or Login is wrong.',
  })
  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authService.verifyUser(dto);
    return fillDto(LoggedUserRdo, verifiedUser);
  }


  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found'
  })
  @Get(':id')
  public async show(@Param('id') id: string) {
    const existUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existUser.toPOJO());
  }
}
