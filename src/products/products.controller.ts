import { ParseIntPipe, Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/commond';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto){
    return await this.client.send({cmd: 'create_product'}, createProductDto);
  }
  @Get()
  async findAllProducts( @Query() paginationDto: PaginationDto ){
    return await this.client.send({cmd: 'find_all_products'}, paginationDto );
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
    // try {
    //   const product = await firstValueFrom(
    //     this.client.send({cmd: 'fine_one_product'},{ id })
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }

  }
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number){
    return await this.client.send({cmd: 'delete_product'}, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Patch(':id')
  async patchProduct(@Param('id', ParseIntPipe) id:number, @Body() updateProductDto: UpdateProductDto){
    return await this.client.send({cmd: 'update_product'}, {
      id, 
      ...updateProductDto
    }).pipe(
      catchError( err => {
        throw new RpcException(err)
      })
    )
  }
}
