import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetChainHistoryPriceDTO {
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
}