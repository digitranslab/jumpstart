import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportExportResourcesController } from '@controllers/import_export_resources.controller';
import { JumpstartDbService } from '@services/jumpstart_db.service';
import { ImportExportResourcesService } from '@services/import_export_resources.service';
import { AppImportExportService } from '@services/app_import_export.service';
import { JumpstartDbImportExportService } from '@services/jumpstart_db_import_export_service';
import { DataSourcesService } from '@services/data_sources.service';
import { AppEnvironmentService } from '@services/app_environments.service';
import { Plugin } from 'src/entities/plugin.entity';
import { PluginsHelper } from 'src/helpers/plugins.helper';
import { CredentialsService } from '@services/credentials.service';
import { DataSource } from 'src/entities/data_source.entity';
import { PluginsModule } from '../plugins/plugins.module';
import { EncryptionService } from '@services/encryption.service';
import { Credential } from '../../../src/entities/credential.entity';
import { CaslModule } from '../casl/casl.module';
import { AppsService } from '@services/apps.service';
import { App } from 'src/entities/app.entity';
import { AppVersion } from 'src/entities/app_version.entity';
import { AppUser } from 'src/entities/app_user.entity';
import { JumpstartDbModule } from '../jumpstart_db/jumpstart_db.module';

const imports = [
  PluginsModule,
  CaslModule,
  TypeOrmModule.forFeature([AppUser, AppVersion, App, Credential, Plugin, DataSource]),
  JumpstartDbModule,
];

@Module({
  imports,
  controllers: [ImportExportResourcesController],
  providers: [
    EncryptionService,
    ImportExportResourcesService,
    AppImportExportService,
    JumpstartDbImportExportService,
    DataSourcesService,
    AppEnvironmentService,
    JumpstartDbService,
    PluginsHelper,
    AppsService,
    CredentialsService,
  ],
  exports: [ImportExportResourcesService],
})
export class ImportExportResourcesModule {}
