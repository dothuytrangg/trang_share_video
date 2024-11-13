import { Test, TestingModule } from '@nestjs/testing';
import { VideoDetailsController } from './video-details.controller';

describe('VideoDetailsController', () => {
  let controller: VideoDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoDetailsController],
    }).compile();

    controller = module.get<VideoDetailsController>(VideoDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
