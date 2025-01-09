import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

  private categories = [];

  create(createCategoryDto: CreateCategoryDto) {


    this.categories.push(createCategoryDto)

    return {
      message: "Se creo la categoria de manera exitosa",
      category: createCategoryDto
    };

  }

  findAll() {
    return {
      categories: this.categories,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  remove(name: string) {

    const newCategoriesCollection = this.categories.filter((category) => category.name !== name)
    

    this.categories = newCategoriesCollection;

    return {
      message: "se elimino las categorias" 
    };
  }
}
