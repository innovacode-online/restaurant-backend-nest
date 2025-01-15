import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { dessertsCategory, drinksCategory, pizzasCategory, soupsCategory } from './data';

@Injectable()
export class SeederService {

    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createCategoriesWithProducts() {
        
        try {
            await this.prisma.product.deleteMany();
            await this.prisma.category.deleteMany();
    
    
            const desserts = this.prisma.category.create({
                data: dessertsCategory
            })
    
            const drinks = this.prisma.category.create({
                data: drinksCategory,
            })
    
            const pizzas = this.prisma.category.create({
                data: pizzasCategory,
            })
    
            const soups = this.prisma.category.create({
                data: soupsCategory,
            })
    
    
            await Promise.all([ desserts, drinks, pizzas, soups ]);
    
            return {
                message: "Datos insertados correctamente"
            }

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Revisar los LOGS del sistema")
        }


    }

}
