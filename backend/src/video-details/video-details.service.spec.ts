import { Test, TestingModule } from '@nestjs/testing';
import { VideoDetailsService } from './video-details.service';

describe('VideoDetailsService', () => {
  let service: VideoDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoDetailsService],
    }).compile();

    service = module.get<VideoDetailsService>(VideoDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
