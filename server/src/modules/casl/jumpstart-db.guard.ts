import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JumpstartDbAbility, JumpstartDbAbilityFactory } from './abilities/jumpstart-db-ability.factory';
import { CHECK_POLICIES_KEY } from './check_policies.decorator';
import { PolicyHandler } from './policyhandler.interface';
import { isEmpty } from 'lodash';
import { EntityManager } from 'typeorm';
import { DataQuery } from 'src/entities/data_query.entity';

@Injectable()
export class JumpstartDbGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jumpstartDbAbilityFactory: JumpstartDbAbilityFactory,
    private manager: EntityManager
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();
    const dataQueryId = request.headers['data-query-id'];
    const organizationId = request.headers['tj-workspace-id'] == 'null' ? null : request.headers['tj-workspace-id'];
    const isPublicAppRequest = isEmpty(organizationId);

    let dataQuery: DataQuery;
    if (isPublicAppRequest && !isEmpty(dataQueryId)) {
      dataQuery = await this.manager.findOne(DataQuery, {
        where: { id: dataQueryId },
        relations: ['apps'],
      });
    }
    request.dataQuery = dataQuery;

    const ability = await this.jumpstartDbAbilityFactory.actions(request.user, { dataQuery, organizationId });

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandler, ability: JumpstartDbAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
