---
to: <%= plugins_path %>/packages/<%= name %>/lib/index.ts
---

import { QueryError, QueryResult, QueryService, ConnectionTestResult } from '@jumpstart-plugins/common';
import { SourceOptions, QueryOptions } from './types';

export default class <%= Name %> implements QueryService {
  async run(sourceOptions: SourceOptions, queryOptions: QueryOptions, dataSourceId: string): Promise<QueryResult> {
    return {
      status: 'ok',
      data: {},
    };
  }
}
