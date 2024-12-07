import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CloneResourcesDto {
  @IsOptional()
  app: CloneAppDto[];

  @IsOptional()
  jumpstart_database: CloneJumpstartDatabaseDto[];

  @IsUUID()
  organization_id: string;
}

export class CloneAppDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}

export class CloneJumpstartDatabaseDto {
  @IsUUID()
  id: string;
}
