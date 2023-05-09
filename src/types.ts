export interface JiraApiBaseItem {
  field: string;
  fromString: string;
  toString: string;
};

export interface JiraApiIssueHistory {
  id: string;
  items: Array<JiraApiBaseItem>;
  created: string;
};

export interface JiraApiIssueChangeLog {
  total: number;
  histories: Array<JiraApiIssueHistory>;
};

export interface JiraApiIssue {
  key: string;
  fields: any;
  changelog: JiraApiIssueChangeLog;
};

export interface JiraApiIssueQueryResponse {
  issues: Array<JiraApiIssue>;
  startAt: number;
  maxResult: number;
  total: number;
  errorMessages?: Array<string>;
};

export interface JiraApiWorkflowStatuses {
  self: string;
  description: string;
  name: string;
  id: string;
  statusCategory: any;
}

export interface JiraApiWorkflow {
  id: string;
  name: string;
  subtask: boolean;
  statuses: Array<JiraApiWorkflowStatuses>;
}

export interface JiraApiError {
  errorMessages: Array<string>;
  errors: any;
}

/* Durations */

export interface ChangelogRow {
  fromValue?: string;
  toValue?: string;
  created: string;
}

export interface DurationInterval {
  fromDate?: Date;
  toDate?: Date;
  durationDays?: number;
}

export interface ChangelogRowDuration {
  fromValue?: string;
  durationInterval?: DurationInterval;
}

export interface DurationIntervals {
  fromDates?: Array<Date>;
  toDates?: Array<Date>;
  durationDays?: number;
}

export interface Attributes {
  [val: string]: string;
};

export interface Auth {
  username?: string;
  password?: string;
  oauth?: {
    consumer_key: string;
    private_key: string,
    token: string;
    token_secret: string;
    signature_method: string;
  };
};

export interface JiraExtractorConfig {
  connection?: {
    url?: string;
    auth?: Auth;
  };
  batchSize?: number;
  customJql?: string;
  attributes?: Attributes;
};
