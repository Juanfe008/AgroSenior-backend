export class RowControlsDto {
    rowIndex: number;
    light: number;
    water: number;
    nutrients: number;
  }
  
  export class UpdateControlsDto {
    rows: RowControlsDto[];
  }