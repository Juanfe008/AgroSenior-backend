import { Injectable } from '@nestjs/common';

@Injectable()
export class TextoGuiaService {
private readonly texts = ['Texto1', 'Texto2', 'Texto3'];

    findAll(): string[] {
      return this.texts;
    }
}
