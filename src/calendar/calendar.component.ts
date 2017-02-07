import { Component, ElementRef, HostListener, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Month, Day } from '../model';
import { CalendarService } from '../shared'

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() first: boolean;
  @Input() startDate: Day;
  @Input() selectedDate: Day;

  @Output() dateSelected: EventEmitter<Day> = new EventEmitter<Day>();
  @Output() clickOutside = new EventEmitter(null);

  FIRST_MONTH = 0;
  LAST_MONTH = 11;

  yearMonths: Array<string>;
  weekDays: Array<string>;
  weeks: Array<Object> = [];
  currentMonth: Month;

  today: Date = new Date();

  className: string = 'calendarmenu';

  constructor(private _elementRef: ElementRef, private calendarService: CalendarService) {}

  ngOnInit() {
    console.log(this.first);
    console.log(this.startDate);
    console.log(this.selectedDate);
    this.initValues();
    this.setCurrentMonth();
    this.buildCalendar();
  }

  initValues() {
    this.yearMonths = this.calendarService.getYearMonths();
    this.weekDays = this.calendarService.getWeekDays();
  }

  buildCalendar() {
    if (this.first) {
      this.className = 'calendarmenu';
    } else {
      this.className = 'calendarmenu calendarright';
    }

    this.weeks = [];
    const DAYS_IN_WEEK = 7;

    // Get the numbers of days in a month, for iteration and rendering purposes
    const daysInMonth = new Date(this.currentMonth.year, this.currentMonth.num + 1, 0).getDate();

    // Get the first day of month to set it in the calendar
    let dayOfWeek = new Date(this.currentMonth.year, this.currentMonth.num, 1).getDay();
    let week: Array<Day> = [];

    let currentDay = 1;

    if (dayOfWeek > 0) {
      // Let empty the slots of the previous month days
      for (let i = 0; i < dayOfWeek; i++) {
        week.push({ class: 'empty', text: '' });
      }
    }

    while (currentDay <= daysInMonth) {
      // End of the week, start a new one
      if (dayOfWeek === DAYS_IN_WEEK) {
        dayOfWeek = 0;
        this.weeks.push(week);
        week = [];
      }

      let className = currentDay === this.selectedDate.day
                        && this.currentMonth.num === this.selectedDate.month
                        && this.currentMonth.year === this.selectedDate.year ? 'monthday selectedday' : 'monthday';

      let disabled = currentDay < this.startDate.day
                        && this.currentMonth.num <= this.startDate.month
                        && this.currentMonth.year <= this.startDate.year;

      if (disabled) {
        className = `${className} disabledday`;
      }

      week.push({
        class: className,
        text: currentDay.toString(),
        day: currentDay,
        month: this.currentMonth.num,
        year: this.currentMonth.year,
        dayOfWeek: dayOfWeek,
        disabled: disabled
      });

      currentDay += 1;
      dayOfWeek += 1;
    }

    // Complete the last week with empty slots
    if (dayOfWeek <= DAYS_IN_WEEK) {
      for (let i = dayOfWeek; i < DAYS_IN_WEEK; i++) {
        week.push({ class: 'empty', text: '' });
      }
      this.weeks.push(week);
    }

  }

  setCurrentMonth() {
    this.currentMonth = { num: this.selectedDate.month, year: this.selectedDate.year, name: this.yearMonths[this.selectedDate.month] };
  }

  showBackButton() {
    return this.currentMonth.num > this.today.getMonth() && this.currentMonth.year === this.today.getFullYear()
            || this.currentMonth.num <= this.today.getMonth() && this.currentMonth.year > this.today.getFullYear();
  }

  showNextButton() {
    return this.currentMonth.num >= this.today.getMonth() && this.currentMonth.year === this.today.getFullYear()
            || this.currentMonth.num < this.today.getMonth() && this.currentMonth.year === this.today.getFullYear() + 1;
  }

  onNextClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.currentMonth.num < this.LAST_MONTH) {
      this.currentMonth = {
        num: this.currentMonth.num + 1,
        year: this.currentMonth.year,
        name: this.yearMonths[this.currentMonth.num + 1]
      };
    } else {
      this.currentMonth = {
        num: this.FIRST_MONTH,
        year: this.currentMonth.year + 1,
        name: this.yearMonths[this.FIRST_MONTH]
      };
    }
    this.buildCalendar();
  }

  onBackClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.currentMonth.num > this.FIRST_MONTH) {
      this.currentMonth = {
        num: this.currentMonth.num - 1,
        year: this.currentMonth.year,
        name: this.yearMonths[this.currentMonth.num - 1]
      };
    } else {
      this.currentMonth = {
        num: this.LAST_MONTH,
        year: this.currentMonth.year - 1,
        name: this.yearMonths[this.LAST_MONTH]
      };
    }
    this.buildCalendar();
  }

  @HostListener('document:click', ['$event.target']) public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(null);
    }
  }

}
