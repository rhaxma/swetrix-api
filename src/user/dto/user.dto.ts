import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserProfileDTO {
  @ApiProperty({ example: 'you@example.com', required: true })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'your_password123', required: true })
  @IsNotEmpty()
  password: string
}
