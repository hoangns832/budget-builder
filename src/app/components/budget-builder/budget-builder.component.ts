import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { BUDGET_DATA, MONTH_OF_YEAR } from '../../common/global.const';
import {
  BudgetCategory,
  BudgetData,
  BudgetSubCategory,
} from '../../interfaces/table-data';
import { BudgetBuilderService } from '../../services/budget-builder.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBuilderComponent {
  @ViewChild('budgetTable') tableEl!: ElementRef<HTMLTableElement>;
  @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

  fromMonth: string = '2024-01';
  toMonth: string = '2024-12';
  monthsOfYear: string[] = MONTH_OF_YEAR;
  budgetData = signal<BudgetData>(BUDGET_DATA);
  tableData = signal<BudgetCategory[]>([]);

  menuOptions = [{ label: 'Apply to all', action: () => this.fillData() }];

  constructor(private budgetBuilderService: BudgetBuilderService) {
    this.tableData.set(
      this.budgetData().incomes.concat(this.budgetData().expenses)
    );
    budgetBuilderService.setTableData(this.tableData());
  }

  ngOnInit() {
    this.budgetBuilderService.tableDataObs().subscribe((data) => {
      this.tableData.set(data);
    });
  }

  ngAfterViewInit() {
    this.tableEl.nativeElement.rows[1].cells[2]?.focus();
  }

  get indexOfFromMonth() {
    return new Date(this.fromMonth).getMonth();
  }

  get indexOfToMonth() {
    return new Date(this.toMonth).getMonth() + 1;
  }

  get displayMonth() {
    return this.monthsOfYear.slice(this.indexOfFromMonth, this.indexOfToMonth);
  }

  get getFlatTableData() {
    return this.tableData().flatMap((item) => [
      item,
      ...(item.subCategories ?? []),
    ]);
  }

  get totalIncome() {
    return computed(() => this.displayMonth.reduce);
  }

  isEdited(data: BudgetCategory | BudgetSubCategory, month: string): boolean {
    return !!data?.values && data?.values[month] !== undefined;
  }

  getBudgetCategory(data: BudgetCategory | BudgetSubCategory) {
    return data as BudgetCategory;
  }

  getBudgetMonthList(values?: Record<string, number>) {
    return (
      values &&
      Object.entries(values).map(([month, value]) => ({
        month,
        value,
      }))
    );
  }

  isDisplayDataOfMonth(index: number) {
    return index >= this.indexOfFromMonth && index <= this.indexOfToMonth;
  }

  openContextMenu(event: MouseEvent) {
    this.contextMenu.open(event);
  }

  onDeleteRow(index: number) {
    this.tableData().splice(index, 1);
    this.budgetBuilderService.setTableData(this.tableData());
  }

  onValueChanged(event: Event, month: string, index: number) {
    const value = Number((event.target as HTMLTableCellElement).textContent);
    const { row, column } = this.budgetBuilderService.getSelectionCell();

    if (column <= 1) {
      return;
    }

    const categoryName =
      this.tableEl.nativeElement.rows[row].cells[1].textContent;
    this.tableData.set(
      this.tableData().map((item) => {
        if (item.values && item.name === categoryName) {
          item.values[month] = value;
        }

        const subCategoryIndex = item?.subCategories?.findIndex(
          (item) => item.name === categoryName
        );
        if (subCategoryIndex !== -1 && item.subCategories) {
          item.subCategories[subCategoryIndex!].values[month] = value;
        }
        return item;
      })
    );

    this.calculateTotal(month, index);
  }

  private calculateTotal(month: string, index: number) {
    this.tableData.set(
      this.tableData().map((item) => {
        const subCategoryTotal =
          item.subCategories?.reduce((sum, item) => {
            return sum + item.values[month];
          }, 0) ?? 0;

        let subTotal = subCategoryTotal;
        item.values && (subTotal += item?.values[month] ?? 0);
        item.subTotal && (item.subTotal[month] = subTotal);
        return item;
      })
    );
    const totalIncome =
      this.tableData().reduce((sum, item) => {
        const incomeIndex = this.budgetData().incomes.findIndex(
          (income) => income.name === item.name
        );
        if (incomeIndex >= 0 && item.subTotal) {
          sum += item.subTotal[month];
        }
        return sum;
      }, 0) ?? 0;
    const totalExpense =
      this.tableData().reduce((sum, item) => {
        const incomeIndex = this.budgetData().expenses.findIndex(
          (expense) => expense.name === item.name
        );
        if (incomeIndex >= 0 && item.subTotal) {
          sum += item.subTotal[month];
        }
        return sum;
      }, 0) ?? 0;
    const profitOrLoss = totalIncome - totalExpense;
    const openingBalance = index === 0 ? 0 : this.budgetData().summary.closingBalance[this.displayMonth[index - 1]]
    this.budgetData.set({
      ...this.budgetData(),
      summary: {
        totalIncome: {
          ...this.budgetData().summary.totalIncome,
          [month]: totalIncome,
        },
        totalExpense: {
          ...this.budgetData().summary.totalExpense,
          [month]: totalExpense,
        },
        profit: {
          ...this.budgetData().summary.profit,
          [month]: profitOrLoss,
        },
        openingBalance: {
          ...this.budgetData().summary.openingBalance,
          [month]: openingBalance,
        },
        closingBalance: {
          ...this.budgetData().summary.closingBalance,
          [month]: profitOrLoss + openingBalance,
        },
      },
    });
  }

  private fillData() {
    const { row, column } = this.budgetBuilderService.getSelectionCell();
    const cellValue =
      this.tableEl.nativeElement.rows[row].cells[column].textContent;
    const header =
      this.tableEl.nativeElement.rows[0].cells[column].textContent?.trim();
    this.tableData.set(
      this.tableData().map((item) => {
        if (
          header &&
          item.values &&
          Object.keys(item.values).includes(header)
        ) {
          const result = {
            ...item,
            values: { ...item.values, [header]: Number(cellValue) },
          };
          item = result;
        }

        if (
          header &&
          item.subCategories &&
          item.subCategories.some((sub) =>
            Object.keys(sub.values).includes(header)
          )
        ) {
          const result = {
            ...item,
            subCategories: item.subCategories.map((sub) => {
              return {
                ...sub,
                values: { ...sub.values, [header]: Number(cellValue) },
              };
            }),
          };
          return result;
        }

        return item;
      })
    );
  }
}
