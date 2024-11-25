import { Module } from '@nestjs/common';
import { HistoryPlaylistController } from './history-playlist.controller';
import { HistoryPlaylistService } from './history-playlist.service';

@Module({
  controllers: [HistoryPlaylistController],
  providers: [HistoryPlaylistService]
})
export class HistoryPlaylistModule {}
