import { Test, TestingModule } from '@nestjs/testing';
import { TextoGuiaController } from './texto-guia.controller';

describe('TextoGuiaController', () => {
  let controller: TextoGuiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextoGuiaController],
    }).compile();

    controller = module.get<TextoGuiaController>(TextoGuiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
