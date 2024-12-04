import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistLikeController } from './playlist-like.controller';

describe('PlaylistLikeController', () => {
  let controller: PlaylistLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistLikeController],
    }).compile();

    controller = module.get<PlaylistLikeController>(PlaylistLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
