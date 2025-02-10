import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
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
  budgetData: BudgetData = BUDGET_DATA;
  tableData: BudgetCategory[] = [];

  menuOptions = [{ label: 'Apply to all', action: () => this.fillData() }];

  constructor(private budgetBuilderService: BudgetBuilderService) {
    this.tableData = this.budgetData.incomes.concat(this.budgetData.expenses);
    budgetBuilderService.setTableData(this.tableData);
  }

  ngOnInit() {
    this.budgetBuilderService.tableDataObs().subscribe((data) => {
      this.tableData = data;
    });
  }

  ngAfterViewInit() {
    this.tableEl.nativeElement.rows[1].cells[2]?.focus();
  }

  get getIndexOfFromMonth() {
    return new Date(this.fromMonth).getMonth();
  }

  get getIndexOfToMonth() {
    return new Date(this.toMonth).getMonth() + 1;
  }

  get getDisplayMonth() {
    return this.monthsOfYear.slice(
      this.getIndexOfFromMonth,
      this.getIndexOfToMonth
    );
  }

  get getFlatTableData() {
    return this.tableData.flatMap((item) => [
      item,
      ...(item.subCategories ?? []),
    ]);
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
    return index >= this.getIndexOfFromMonth && index <= this.getIndexOfToMonth;
  }

  openContextMenu(event: MouseEvent) {
    this.contextMenu.open(event);
  }

  onDeleteRow(index: number) {
    this.tableData.splice(index, 1);
    this.budgetBuilderService.setTableData(this.tableData);
  }

  onValueChanged(event: Event, month: string) {
    const value = Number((event.target as HTMLTableCellElement).textContent);
    const { row } = this.budgetBuilderService.getSelectionCell();
    this.tableData.forEach((item) => {
      if (
        item.name === this.tableEl.nativeElement.rows[row].cells[1].textContent
      ) {
        item.subTotal = this.calculateTotal(item, month);
      }
    });
  }

  private calculateTotal(
    item: BudgetCategory,
    month: string
  ): Record<string, number> {
    const total =
      item.subCategories?.reduce((sum, sub) => {
        return sum + sub.values[month];
      }, 0) ?? 0;
    return { [month]: item?.values ? total ?? 0 + item?.values[month] : total };
  }

  private fillData() {
    const { row, column } = this.budgetBuilderService.getSelectionCell();
    const cellValue =
      this.tableEl.nativeElement.rows[row].cells[column].textContent;
    const header =
      this.tableEl.nativeElement.rows[0].cells[column].textContent?.trim();
    this.tableData = this.tableData.map((item) => {
      if (header && item.values && Object.keys(item.values).includes(header)) {
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
    });
  }
}
