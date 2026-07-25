export interface TrialAST {
  type: 'Trial';
  name: string;
  description: string;
  includeRules: Condition[];
  excludeRules: Condition[];
  requirements: Requirement[];
}

export interface Condition {
  type: 'Condition';
  field: string;
  operator: string;
  value: string | number | [number, number];
}

export interface Requirement {
  type: 'Requirement';
  field: string;
  duration: number;
  unit: string;
}

export function parseTrial(code: string): TrialAST {
  return {
    type: 'Trial',
    name: 'Sample Trial',
    description: 'Sample description',
    includeRules: [],
    excludeRules: [],
    requirements: [],
  };
}
