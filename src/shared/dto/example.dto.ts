import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsBoolean,
  IsEnum,
  IsDateString,
  Matches,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(18, { message: 'Age must be at least 18' })
  @Max(120, { message: 'Age cannot exceed 120' })
  age?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: admin, user, moderator' })
  role?: UserRole;

  @IsOptional()
  @IsDateString({}, { message: 'birthDate must be a valid date string' })
  birthDate?: string;
}
