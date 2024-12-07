import {
  All,
  Controller,
  Req,
  Res,
  Next,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseFilters,
  Put,
} from '@nestjs/common';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ActiveWorkspaceGuard } from 'src/modules/auth/active-workspace.guard';
import { JumpstartDbService } from '@services/jumpstart_db.service';
import { decamelizeKeys } from 'humps';
import { PostgrestProxyService } from '@services/postgrest_proxy.service';
import { CheckPolicies } from 'src/modules/casl/check_policies.decorator';

import { Action, JumpstartDbAbility } from 'src/modules/casl/abilities/jumpstart-db-ability.factory';
import { JumpstartDbGuard } from 'src/modules/casl/jumpstart-db.guard';
import {
  CreatePostgrestTableDto,
  EditTableDto,
  EditColumnTableDto,
  PostgrestForeignKeyDto,
  AddColumnDto,
} from '@dto/jumpstart-db.dto';
import { OrganizationAuthGuard } from 'src/modules/auth/organization-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JumpstartDbBulkUploadService } from '@services/jumpstart_db_bulk_upload.service';
import { JumpstartDbJoinDto } from '@dto/jumpstart-db-join.dto';
import { JumpstartDbJoinExceptionFilter } from 'src/filters/jumpstartdb-join-exceptions-filter';
import { Logger } from 'nestjs-pino';
import { JumpstartDbExceptionFilter } from 'src/filters/jumpstartdb-exception-filter';

const MAX_CSV_FILE_SIZE = 1024 * 1024 * 2; // 2MB

@Controller('jumpstart-db')
@UseFilters(JumpstartDbExceptionFilter)
export class JumpstartDbController {
  private readonly pinoLogger: Logger;
  constructor(
    private readonly jumpstartDbService: JumpstartDbService,
    private readonly postgrestProxyService: PostgrestProxyService,
    private readonly jumpstartDbBulkUploadService: JumpstartDbBulkUploadService,
    private readonly logger: Logger
  ) {
    this.pinoLogger = logger;
  }

  @All('/proxy/*')
  @UseGuards(OrganizationAuthGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.ProxyPostgrest, 'all'))
  async proxy(@Req() req, @Res() res, @Next() next) {
    return this.postgrestProxyService.proxy(req, res, next);
  }

  @Get('/organizations/:organizationId/tables')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.ViewTables, 'all'))
  async tables(@Param('organizationId') organizationId) {
    const result = await this.jumpstartDbService.perform(organizationId, 'view_tables');
    return decamelizeKeys({ result });
  }

  @Get('/organizations/:organizationId/table/:tableName')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.ViewTable, 'all'))
  async table(@Body() body, @Param('organizationId') organizationId, @Param('tableName') tableName) {
    const result = await this.jumpstartDbService.perform(organizationId, 'view_table', { table_name: tableName });
    return decamelizeKeys({ result });
  }

  @Post('/organizations/:organizationId/table')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.CreateTable, 'all'))
  async createTable(@Body() createTableDto: CreatePostgrestTableDto, @Param('organizationId') organizationId) {
    const result = await this.jumpstartDbService.perform(organizationId, 'create_table', createTableDto);
    return decamelizeKeys({ result });
  }

  @Patch('/organizations/:organizationId/table/:tableName')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.RenameTable, 'all'))
  async editTable(@Body() editTableBody: EditTableDto, @Param('organizationId') organizationId) {
    const result = await this.jumpstartDbService.perform(organizationId, 'edit_table', editTableBody);
    return decamelizeKeys({ result });
  }

  @Delete('/organizations/:organizationId/table/:tableName')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.DropTable, 'all'))
  async dropTable(@Param('organizationId') organizationId, @Param('tableName') tableName) {
    const result = await this.jumpstartDbService.perform(organizationId, 'drop_table', { table_name: tableName });
    return decamelizeKeys({ result });
  }

  @Post('/organizations/:organizationId/table/:tableName/column')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.AddColumn, 'all'))
  async addColumn(
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @Body() addColumnBody: AddColumnDto
  ) {
    const params = {
      table_name: tableName,
      column: addColumnBody.column,
      foreign_keys: addColumnBody?.foreign_keys || [],
    };
    const result = await this.jumpstartDbService.perform(organizationId, 'add_column', params);
    return decamelizeKeys({ result });
  }

  @Delete('/organizations/:organizationId/table/:tableName/column/:columnName')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.DropColumn, 'all'))
  async dropColumn(
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @Param('columnName') columnName
  ) {
    const params = {
      table_name: tableName,
      column: { column_name: columnName },
    };

    const result = await this.jumpstartDbService.perform(organizationId, 'drop_column', params);
    return decamelizeKeys({ result });
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/organizations/:organizationId/table/:tableName/bulk-upload')
  async bulkUpload(
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file.size > MAX_CSV_FILE_SIZE) {
      throw new BadRequestException('File size cannot be greater than 2MB');
    }
    const result = await this.jumpstartDbBulkUploadService.perform(organizationId, tableName, file.buffer);

    return decamelizeKeys({ result });
  }

  @Post('/organizations/:organizationId/join')
  @UseFilters(new JumpstartDbJoinExceptionFilter())
  @UseGuards(JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.JoinTables, 'all'))
  async joinTables(@Body() jumpstartDbJoinDto: JumpstartDbJoinDto, @Param('organizationId') organizationId) {
    const params = {
      joinQueryJson: { ...jumpstartDbJoinDto },
    };

    const result = await this.jumpstartDbService.perform(organizationId, 'join_tables', params);
    return decamelizeKeys({ result });
  }
  @Patch('/organizations/:organizationId/table/:tableName/column')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.EditColumn, 'all'))
  async editColumn(
    @Body('column') columnDto: EditColumnTableDto,
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @Body('foreignKeyIdToDelete') foreignKeyIdToDelete?: string
  ) {
    const params = {
      table_name: tableName,
      column: columnDto,
      foreign_key_id_to_delete: foreignKeyIdToDelete || '',
    };
    const result = await this.jumpstartDbService.perform(organizationId, 'edit_column', params);
    return decamelizeKeys({ result });
  }

  @Post('/organizations/:organizationId/table/:tableName/foreignkey')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.AddForeignKey, 'all'))
  async createForeignKey(
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @Body('foreign_keys') foreign_keys: Array<PostgrestForeignKeyDto>
  ) {
    const params = {
      table_name: tableName,
      foreign_keys: foreign_keys,
    };
    const result = await this.jumpstartDbService.perform(organizationId, 'create_foreign_key', params);
    return decamelizeKeys({ result });
  }

  @Put('/organizations/:organizationId/table/:tableName/foreignkey')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.UpdateForeignKey, 'all'))
  async updateForeignKey(
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @Body('foreign_key_id') foreign_key_id: string,
    @Body('foreign_keys') foreign_keys: Array<PostgrestForeignKeyDto>
  ) {
    const params = {
      table_name: tableName,
      foreign_key_id: foreign_key_id,
      foreign_keys: foreign_keys,
    };
    const result = await this.jumpstartDbService.perform(organizationId, 'update_foreign_key', params);
    return decamelizeKeys({ result });
  }

  @Delete('/organizations/:organizationId/table/:tableName/foreignkey/:foreignKeyId')
  @UseGuards(JwtAuthGuard, ActiveWorkspaceGuard, JumpstartDbGuard)
  @CheckPolicies((ability: JumpstartDbAbility) => ability.can(Action.DeleteForeignKey, 'all'))
  async deleteForeignKey(
    @Param('organizationId') organizationId,
    @Param('tableName') tableName,
    @Param('foreignKeyId') foreignKeyId: string
  ) {
    const params = {
      table_name: tableName,
      foreign_key_id: foreignKeyId,
    };
    const result = await this.jumpstartDbService.perform(organizationId, 'delete_foreign_key', params);
    return decamelizeKeys({ result });
  }
}
