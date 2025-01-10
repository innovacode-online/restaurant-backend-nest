import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {


  constructor(
    private readonly prisma: PrismaService
  ){}


  async create(createCategoryDto: CreateCategoryDto) {

    // EVALUAR SI LA CATEGORIA EXISTE
    const categoryExists = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name
      }
    })

    if( categoryExists ){
      throw new BadRequestException("La categoria ya existe")
    }

    // CREAR CATEGORIA

    const category = await this.prisma.category.create({
      data: {
        description: createCategoryDto.description,
        name: createCategoryDto.name,
        slug: createCategoryDto.name
      }
    })

    return {
      message: "Se creo la categoria de manera exitosa",
      category
    };

  }

  async findAll() {

    const categories = await this.prisma.category.findMany();

    return {
      categories,
    };
  }

  async findOne(term: string) {

    const category = await this.prisma.category.findFirst({
      where: {
        id: term,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            price: true
          }
        }
      }
    })

    if( !category ){
      throw new NotFoundException("No se encontro la categoria")
    }

    return {
      category,
    }

  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    await this.findOne(id);

    const categoryUpdate = await this.prisma.category.update({
      where: { id: id },
      data: updateCategoryDto,
    })

    return {
      message: "Categoria actualizada",
      category: categoryUpdate,
    }
  }

  async remove(id: string) {

    const { category } = await this.findOne(id);

    await this.prisma.category.delete({
      where: { id: category.id }
    })

    return {
      message: "La categoria se elimino"
    }
  }
}
