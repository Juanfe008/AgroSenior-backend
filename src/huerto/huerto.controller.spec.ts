import { Test, TestingModule } from '@nestjs/testing';
import { HuertoController } from './huerto.controller';

describe('HuertoController', () => {
  let controller: HuertoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuertoController],
    }).compile();

    controller = module.get<HuertoController>(HuertoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
