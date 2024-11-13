import { Test, TestingModule } from '@nestjs/testing';
import { TagsDetailController } from './tags-detail.controller';

describe('TagsDetailController', () => {
  let controller: TagsDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsDetailController],
    }).compile();

    controller = module.get<TagsDetailController>(TagsDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
