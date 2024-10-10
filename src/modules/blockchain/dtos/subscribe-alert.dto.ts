import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, Min } from "class-validator";

export class SubscribeAlertDTO {
  @ApiProperty({
    type: String,
    enum: [
      'ETH',
      'WBTC',
    ],
    description: 'Chain',
  })
  @IsNotEmpty()
  chain: string;

  @ApiProperty({
    type: String,
    minimum: 0,
    description: 'Price',
  })
  @Type(() => Number)
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @Min(0)
  price: number;

  @ApiProperty({
    type: String,
    description: 'E-mail address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}