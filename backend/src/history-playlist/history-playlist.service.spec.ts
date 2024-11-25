import { Test, TestingModule } from '@nestjs/testing';
import { HistoryPlaylistService } from './history-playlist.service';

describe('HistoryPlaylistService', () => {
  let service: HistoryPlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryPlaylistService],
    }).compile();

    service = module.get<HistoryPlaylistService>(HistoryPlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
