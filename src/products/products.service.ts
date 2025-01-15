import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug } from 'src/helpers';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createProductDto: CreateProductDto) {

    const slug = convertToSlug(createProductDto.name);

    const productExists = await this.prisma.product.findFirst({
      where: { slug: slug }
    })

    if (productExists) {
      throw new BadRequestException("Ya se registro un producto con este nombre");
    }


    // CREAR CATEGORIA
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug,
      },
    })

    return {
      message: "Se creo producto de manera exitosa",
      product
    };


  }

  async findAll(paginationDto: PaginationDto) {

    const { limit, page, orderBy } = paginationDto;

    const totalProducts = await this.prisma.product.count();
    const lastPage = Math.ceil(totalProducts / limit);


    const products = await this.prisma.product.findMany({

      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        updatedAt: orderBy,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          }
        }
      }
    });

    return {
      products,
      meta: {
        totalItems: totalProducts,
        page,
        lastPage
      }
    };
  }

  async findOne(slug: string) {

    const product = await this.prisma.product.findFirst({
      where: { slug }
    })

    if (!product) {
      throw new NotFoundException("No se encontro el producto");
    }

    return {
      product
    }


  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    

    const product = await this.prisma.product.findFirst({
      where: { id }
    })

    if (!product) {
      throw new NotFoundException("No se encontro el producto");
    }



    if( updateProductDto.name ){
      updateProductDto.slug = convertToSlug(updateProductDto.name);
    }


    const productUpdated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto
    })

    return {
      message: "Producto actualizado",
      product: productUpdated
    }

  }

  async remove(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id }
    })

    if (!product) {
      throw new NotFoundException("No se encontro el producto");
    }

    await this.prisma.product.delete({
      where: { id }
    })

    return {
      message: "Se elimino el producto"
    }

  }
}
