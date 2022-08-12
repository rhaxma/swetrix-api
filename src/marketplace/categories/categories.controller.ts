import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'
import { CreateCategory } from './dtos/create-category.dto'
import { DeleteCategoryParams } from './dtos/delete-category-params.dto'
import { GetCategoriesQueries } from './dtos/get-categories-queries.dto'
import { GetCategoryParams } from './dtos/get-category-params.dto'
import { UpdateCategoryParams } from './dtos/update-category-params.dto'
import { UpdateCategory } from './dtos/update-category.dto'
import { ISaveCategory } from './interfaces/save-category.interface'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Query() queries: GetCategoriesQueries): Promise<{
    categories: Category[]
    count: number
  }> {
    const [categories, count] = await this.categoriesService.findAndCount({
      skip: queries.offset || 0,
      take: queries.limit > 100 ? 25 : queries.limit || 25,
    })

    return { categories, count }
  }

  @Get(':categoryId')
  async getCategory(@Param() params: GetCategoryParams): Promise<Category> {
    const category = await this.categoriesService.findById(params.categoryId)

    if (!category) {
      throw new NotFoundException('Category not found.')
    }

    return category
  }

  @Post()
  async createCategory(
    @Body() body: CreateCategory,
  ): Promise<ISaveCategory & Category> {
    const title = await this.categoriesService.findTitle(body.title)

    if (title) {
      throw new ConflictException('The category already exists.')
    }

    const categoryInstance = this.categoriesService.create(body)

    return await this.categoriesService.save(categoryInstance)
  }

  @Patch(':categoryId')
  async updateCategory(
    @Param() params: UpdateCategoryParams,
    @Body() body: UpdateCategory,
  ): Promise<UpdateCategory> {
    const category = await this.categoriesService.findById(params.categoryId)

    if (!category) {
      throw new NotFoundException('Category not found.')
    }

    await this.categoriesService.update(category.id, body)

    return body
  }

  @Delete(':categoryId')
  async deleteCategory(@Param() params: DeleteCategoryParams): Promise<void> {
    const category = await this.categoriesService.findById(params.categoryId)

    if (!category) {
      throw new NotFoundException('Category not found.')
    }

    await this.categoriesService.delete(category.id)
  }
}
