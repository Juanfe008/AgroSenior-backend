import { Test, TestingModule } from '@nestjs/testing';
import { HuertoService } from './huerto.service';

describe('HuertoService', () => {
  let service: HuertoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuertoService],
    }).compile();

    service = module.get<HuertoService>(HuertoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
