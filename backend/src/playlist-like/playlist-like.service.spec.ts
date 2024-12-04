import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistLikeService } from './playlist-like.service';

describe('PlaylistLikeService', () => {
  let service: PlaylistLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistLikeService],
    }).compile();

    service = module.get<PlaylistLikeService>(PlaylistLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
