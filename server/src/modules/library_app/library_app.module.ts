import { Module } from '@nestjs/common';
import { LibraryAppsController } from '@controllers/library_apps.controller';
import { LibraryAppCreationService } from '@services/library_app_creation.service';
import { AppImportExportService } from '@services/app_import_export.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from 'src/entities/app.entity';
import { DataSourcesService } from '@services/data_sources.service';
import { CredentialsService } from '@services/credentials.service';
import { EncryptionService } from '@services/encryption.service';
import { Credential } from 'src/entities/credential.entity';
import { DataSource } from 'src/entities/data_source.entity';
import { CaslModule } from '../casl/casl.module';
import { FilesService } from '@services/files.service';
import { File } from 'src/entities/file.entity';
import { PluginsService } from '@services/plugins.service';
import { Plugin } from 'src/entities/plugin.entity';
import { PluginsHelper } from 'src/helpers/plugins.helper';
import { AppEnvironmentService } from '@services/app_environments.service';
import { ImportExportResourcesModule } from '../import_export_resources/import_export_resources.module';
import { AppsService } from '@services/apps.service';
import { AppVersion } from 'src/entities/app_version.entity';
import { AppUser } from 'src/entities/app_user.entity';
import { JumpstartDbModule } from '../jumpstart_db/jumpstart_db.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([App, Credential, File, Plugin, DataSource, AppVersion, AppUser]),
    CaslModule,
    ImportExportResourcesModule,
    JumpstartDbModule,
  ],
  providers: [
    EncryptionService,
    CredentialsService,
    DataSourcesService,
    LibraryAppCreationService,
    AppImportExportService,
    FilesService,
    PluginsService,
    PluginsHelper,
    AppEnvironmentService,
    AppsService,
  ],
  controllers: [LibraryAppsController],
})
export class LibraryAppModule {}
