import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productsService: ProductsService
    ){}

    async create(createOrderDto: CreateOrderDto){

        const { orderItems } = createOrderDto;


        // VALIDAR QUE EXISTAN LOS PRODUCTOS
        const productIds = createOrderDto.orderItems.map(product => product.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        })

        if( products.length !== productIds.length ){
            throw new BadRequestException("No se encontro un producto");
        }


        // VERIFICAR Y ACTUALIZAR STOCK DE PRODUCTOS
        products.map((product, index) => {
            if( product.stock < orderItems[index].quantity ){
                throw new BadRequestException("No hay stock suficiente");
            }
        })

        
        products.map((product, index) => {
            const newStock = product.stock - orderItems[index].quantity;
            this.productsService.update(product.id, {stock: newStock})            
        })


        // GUARDAR ORDEN
        await this.prisma.order.create({
            data: createOrderDto,
        })

        return {
            message: "Se genero la orden"
        };

    }

    async findAll(){
        const orders = await this.prisma.order.findMany();
        return orders;
    }

}
