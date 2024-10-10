import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Min } from "class-validator";

export class GetBitcoinRateFromEthereumDTO {
  @ApiProperty({
    type: Number,
    minimum: 0,
    description: 'Amount in ETH',
  })
  @Type(() => Number)
  @Min(0)
  amount: number;
}