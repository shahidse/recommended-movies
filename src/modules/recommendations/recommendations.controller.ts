import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}
  private readonly logger = new Logger(RecommendationsController.name);
  @MessagePattern({ cmd: 'recommend-movies' })
  async getMovies(@Payload() userId: number): Promise<any> {
    this.logger.log(`Executing ${this.getMovies.name} with payload: ${userId}`);
    return this.recommendationsService.recommendMovies(userId);
  }
}
