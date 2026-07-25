import { TrialAST } from '@/lib/parser';

export function transpileToSQL(ast: TrialAST): string {
  return 'SELECT * FROM patients WHERE 1=1';
}
