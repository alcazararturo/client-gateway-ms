import { Type } from 'class-transformer'
import { IsNumber , IsPositive, IsString} from "class-validator";

export class OrderItemDto {
    @IsNumber()
    @IsPositive()
    productId: number;
    @IsNumber()
    @IsPositive()
    quantity : number;
    @IsNumber()
    @IsPositive()
    @Type(()=>Number)
    price    : number;
}