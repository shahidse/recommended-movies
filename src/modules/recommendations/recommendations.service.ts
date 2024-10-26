import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Movie } from 'src/entities/movies.entity';
import { User } from 'src/entities/users.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(RecommendationsService.name);
  async recommendMovies(userId: number): Promise<any> {
    this.logger.log(`Executing ${this.recommendMovies.name}`);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.categories || user.categories.length === 0) {
      return [];
    }

    const categoriesTitle: string[] = user.categories as string[];
    // Step 1: Fetch category IDs based on the titles
    const categories = await this.categoriesRepository.findBy({
      name: In(categoriesTitle), // Adjust according to your actual field name for titles
    });

    // Extract the category IDs
    const categoryIds = categories.map((category) => category.id);

    // Step 2: Fetch movies using the category IDs
    return this.moviesRepository.findBy({
      categoryId: In(categoryIds),
    });
  }
}
