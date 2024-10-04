import { Test, TestingModule } from '@nestjs/testing';
import { TextoGuiaService } from './texto-guia.service';

describe('TextoGuiaService', () => {
  let service: TextoGuiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextoGuiaService],
    }).compile();

    service = module.get<TextoGuiaService>(TextoGuiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
