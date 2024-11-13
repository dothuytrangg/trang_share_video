import { Test, TestingModule } from '@nestjs/testing';
import { TagsDetailService } from './tags-detail.service';

describe('TagsDetailService', () => {
  let service: TagsDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsDetailService],
    }).compile();

    service = module.get<TagsDetailService>(TagsDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
