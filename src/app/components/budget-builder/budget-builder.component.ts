import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { TableData } from '../../interfaces/table-data';
import { BudgetBuilderService } from '../../services/budget-builder.service';

@Component({
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBuilderComponent {
  @ViewChild('budgetTable') table!: ElementRef<HTMLTableElement>;

  fromMonth: string = '2024-01';
  toMonth: string = '2024-12';
  monthsOfYear: string[] = [
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
  tableData: TableData[] = [
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
  ];

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
}
