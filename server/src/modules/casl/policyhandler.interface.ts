import { AppAbility } from '../casl/casl-ability.factory';
import { JumpstartDbAbility } from './abilities/jumpstart-db-ability.factory';

interface IPolicyHandler {
  handle(ability: AppAbility | JumpstartDbAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility | JumpstartDbAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
