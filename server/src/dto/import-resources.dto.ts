import { IsUUID, IsOptional, IsString, IsDefined } from 'class-validator';

export class ImportResourcesDto {
  @IsUUID()
  organization_id: string;

  @IsString()
  jumpstart_version: string;

  @IsOptional()
  app: ImportAppDto[];

  @IsOptional()
  jumpstart_database: ImportJumpstartDatabaseDto[];
}

export class ImportAppDto {
  @IsDefined()
  definition: any;

  @IsString()
  appName: string;
}

export class ImportJumpstartDatabaseDto {
  @IsUUID()
  id: string;

  @IsString()
  table_name: string;

  @IsDefined()
  schema: any;

  // @IsOptional()
  // data: boolean;
}
