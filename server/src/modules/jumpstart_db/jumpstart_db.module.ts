import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from '../../../src/entities/credential.entity';
import { JumpstartDbController } from '@controllers/jumpstart_db.controller';
import { CaslModule } from '../casl/casl.module';
import { JumpstartDbService } from '@services/jumpstart_db.service';
import { PostgrestProxyService } from '@services/postgrest_proxy.service';
import { JumpstartDbBulkUploadService } from '@services/jumpstart_db_bulk_upload.service';
import { JumpstartDbOperationsService } from '@services/jumpstart_db_operations.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Credential]), CaslModule],
  controllers: [JumpstartDbController],
  providers: [JumpstartDbService, JumpstartDbBulkUploadService, JumpstartDbOperationsService, PostgrestProxyService],
  exports: [JumpstartDbOperationsService],
})
export class JumpstartDbModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const enableJumpstartDb = this.configService.get('ENABLE_JUMPSTART_DB') === 'true';
    console.log(`JumpStart Database enabled: ${enableJumpstartDb}`);
  }
}
