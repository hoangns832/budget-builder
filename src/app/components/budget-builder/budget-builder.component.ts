import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { BUDGET_DATA, MONTH_OF_YEAR } from '../../common/global.const';
import { BudgetCategory, BudgetData } from '../../interfaces/table-data';
import { BudgetBuilderService } from '../../services/budget-builder.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBuilderComponent {
  @ViewChild('budgetTable') table!: ElementRef<HTMLTableElement>;
  @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

  fromMonth: string = '2024-01';
  toMonth: string = '2024-12';
  monthsOfYear: string[] = MONTH_OF_YEAR;
  budgetData: BudgetData = BUDGET_DATA;
  tableData: BudgetCategory[] = []

  menuOptions = [{ label: 'Apply to all', action: () => this.fillData() }];

  constructor(private budgetBuilderService: BudgetBuilderService) {
    budgetBuilderService.setTableData(this.tableData);
  }

  ngOnInit() {
    this.budgetBuilderService.tableDataObs().subscribe((data) => {
      this.tableData = data;
    });
  }

  ngAfterViewInit() {
    this.table.nativeElement.rows[1].cells[3]?.focus();
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

  isDisplayDataOfMonth(index: number) {
    return index >= this.getIndexOfFromMonth && index <= this.getIndexOfToMonth;
  }

  openContextMenu(event: MouseEvent) {
    this.contextMenu.open(event);
  }

  private fillData() {
    const { row, column } = this.budgetBuilderService.getSelectionCell();
    const cellValue =
      this.table.nativeElement.rows[row].cells[column].textContent;
    const header = this.table.nativeElement.rows[0].cells[column].textContent
      ?.trim()
      .toLowerCase();
    this.tableData = this.tableData.map((item) => {
      if (header && Object.keys(item).includes(header)) {
        const result = { ...item, [header]: Number(cellValue) };
        console.log(result);
        return result;
      }
      return item;
    });
  }
}
