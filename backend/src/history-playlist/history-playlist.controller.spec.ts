import { Test, TestingModule } from '@nestjs/testing';
import { HistoryPlaylistController } from './history-playlist.controller';

describe('HistoryPlaylistController', () => {
  let controller: HistoryPlaylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryPlaylistController],
    }).compile();

    controller = module.get<HistoryPlaylistController>(HistoryPlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
