export interface BudgetCategory {
  name: string;
  subCategories: BudgetSubCategory[];
  subTotal: Record<string, number>;
  values?: Record<string, number>;
}

export interface BudgetSubCategory {
  name: string;
  values: Record<string, number>;
}

export interface BudgetData {
  incomes: BudgetCategory[];
  expenses: BudgetCategory[];
  summary: {
    totalIncome: Record<string, number>;
    totalExpense: Record<string, number>;
    profit: Record<string, number>;
    openingBalance: Record<string, number>;
    closingBalance: Record<string, number>;
  };
}

export interface SelectionCell {
  row: number;
  column: number;
}
