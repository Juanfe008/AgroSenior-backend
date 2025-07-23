import { Test, TestingModule } from '@nestjs/testing';
import { ActividadesController } from './actividades.controller';
import { ActividadesService } from './actividades.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ActividadesController', () => {
  let controller: ActividadesController;
  
  // Definimos el tipo para una actividad
  type MockActivity = {
    id: number;
    title: string;
    desc: string;
    nivelMin: number;
    completada?: boolean;
    exp: number;
    tipo: string;
    evento: string;
    imageUrl?: string;
  };

  // Mock completo tipado del servicio
  const mockActividadesService = {
    getAvailableActivities: jest.fn<Promise<MockActivity[]>, [number]>(),
    createActivity: jest.fn<Promise<MockActivity>, [Omit<MockActivity, 'id'>]>(),
    completeActivity: jest.fn<Promise<{success: boolean}>, [number, number]>(),
    update: jest.fn<Promise<MockActivity>, [number, Partial<Omit<MockActivity, 'id'>>]>(),
    remove: jest.fn<Promise<{deleted: boolean}>, [number]>(),
    findAll: jest.fn<Promise<MockActivity[]>, []>(),
    findOne: jest.fn<Promise<MockActivity>, [number]>(),
  };

  // Mock del guard
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActividadesController],
      providers: [
        {
          provide: ActividadesService,
          useValue: mockActividadesService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<ActividadesController>(ActividadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvailableActivities', () => {
    it('should call service.getAvailableActivities with userId', async () => {
      const userId = '1';
      const expectedResult: MockActivity[] = [{
        id: 1, 
        title: 'Actividad 1',
        desc: 'Descripción',
        nivelMin: 1,
        exp: 10,
        tipo: 'Tipo',
        evento: 'Evento',
        imageUrl: 'url'
      }];
      
      mockActividadesService.getAvailableActivities.mockResolvedValue(expectedResult);
      
      const result = await controller.getAvailableActivities(userId);
      
      expect(mockActividadesService.getAvailableActivities).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createActivity', () => {
    it('should call service.createActivity with activity data', async () => {
      const activityData = {
        title: 'Nueva Actividad',
        desc: 'Descripción',
        nivelMin: 1,
        exp: 10,
        tipo: 'Tipo',
        evento: 'Evento'
      };
      const expectedResult: MockActivity = { id: 1, ...activityData };
      
      mockActividadesService.createActivity.mockResolvedValue(expectedResult);
      
      const result = await controller.createActivity(activityData);
      
      expect(mockActividadesService.createActivity).toHaveBeenCalledWith(activityData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('completeActivity', () => {
    it('should call service.completeActivity with userId and actividadId', async () => {
      const body = { userId: 1, actividadId: 1 };
      const expectedResult = { success: true };
      
      mockActividadesService.completeActivity.mockResolvedValue(expectedResult);
      
      const result = await controller.completeActivity(body);
      
      expect(mockActividadesService.completeActivity).toHaveBeenCalledWith(body.userId, body.actividadId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateActivity', () => {
    it('should call service.update with id and update data', async () => {
      const id = '1';
      const updateData = { title: 'Título actualizado' };
      const expectedResult: MockActivity = { 
        id: 1, 
        title: 'Título actualizado',
        desc: 'Descripción',
        nivelMin: 1,
        exp: 10,
        tipo: 'Tipo',
        evento: 'Evento'
      };
      
      mockActividadesService.update.mockResolvedValue(expectedResult);
      
      const result = await controller.updateActivity(id, updateData);
      
      expect(mockActividadesService.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeActivity', () => {
    it('should call service.remove with id', async () => {
      const id = '1';
      const expectedResult = { deleted: true };
      
      mockActividadesService.remove.mockResolvedValue(expectedResult);
      
      const result = await controller.removeActivity(id);
      
      expect(mockActividadesService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const expectedResult: MockActivity[] = [{
        id: 1, 
        title: 'Actividad 1',
        desc: 'Descripción',
        nivelMin: 1,
        exp: 10,
        tipo: 'Tipo',
        evento: 'Evento'
      }];
      
      mockActividadesService.findAll.mockResolvedValue(expectedResult);
      
      const result = await controller.findAll();
      
      expect(mockActividadesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const id = '1';
      const expectedResult: MockActivity = {
        id: 1, 
        title: 'Actividad 1',
        desc: 'Descripción',
        nivelMin: 1,
        exp: 10,
        tipo: 'Tipo',
        evento: 'Evento'
      };
      
      mockActividadesService.findOne.mockResolvedValue(expectedResult);
      
      const result = await controller.findOne(id);
      
      expect(mockActividadesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});