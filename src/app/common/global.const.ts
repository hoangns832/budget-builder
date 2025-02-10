import { BudgetData } from '../interfaces/table-data';

export const MONTH_OF_YEAR = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const BUDGET_DATA: BudgetData = {
  incomes: [
    {
      name: 'General Income',
      subCategories: [
        {
          name: 'Sales',
          values: { January: 200, February: 400 },
        },
        {
          name: 'Commission',
          values: { January: 0, February: 200 },
        },
      ],
      values: { January: 100, February: 120 },
      subTotal: { January: 300, February: 720 },
    },
    {
      name: 'Other Income',
      subCategories: [
        {
          name: 'Training',
          values: { January: 500, February: 550 },
        },
        {
          name: 'Consulting',
          values: { January: 500, February: 600 },
        },
      ],
      subTotal: { January: 1000, February: 1150 },
    },
  ],
  expenses: [
    {
      name: 'Operational Expenses',
      subCategories: [
        {
          name: 'Management Fees',
          values: { January: 100, February: 200 },
        },
        {
          name: 'Cloud Hosting',
          values: { January: 200, February: 400 },
        },
      ],
      values: { January: 50, February: 100 },
      subTotal: { January: 350, February: 700 },
    },
    {
      name: 'Salaries & Wages',
      subCategories: [
        {
          name: 'Full Time Dev Salaries',
          values: { January: 100, February: 120 },
        },
        {
          name: 'Part Time Dev Salaries',
          values: { January: 80, February: 80 },
        },
        {
          name: 'Remote Salaries',
          values: { January: 20, February: 0 },
        },
      ],
      subTotal: { January: 200, February: 200 },
    },
  ],
  summary: {
    totalIncome: { January: 1300, February: 1870 },
    totalExpense: { January: 550, February: 900 },
    profit: { January: 750, February: 970 },
    openingBalance: { January: 0, February: 750 },
    closingBalance: { January: 750, February: 1720 },
  },
};
