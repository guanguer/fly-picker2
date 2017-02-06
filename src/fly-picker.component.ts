import { Component, ElementRef, HostListener } from '@angular/core';
import { Month, Day } from './model';

@Component({
  selector: 'fly-picker',
  templateUrl: './fly-picker.component.html',
  styleUrls: ['./fly-picker.component.css']
})
export class FlyPickerComponent {
  FIRST_MONTH = 0;
  LAST_MONTH = 11;
  yearMonths: Array<string> = [
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
    'December'
  ];
  weekDays: Array<string> = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];
  weeks: Array<Object> = [];


  currentMonth: Month;
  departureDate: Day;
  departureDay: String = '';

  today: Date = new Date();
  showCalendar: boolean = false;
  showBack: boolean = false;
  showNext: boolean = false;

  constructor(private _elementRef: ElementRef) {}

  openCalendar() {
    if (!this.showCalendar) {
      if (this.departureDate === undefined) {
        this.departureDate = {
          day: this.today.getDate(),
          month: this.today.getMonth(),
          year: this.today.getFullYear(),
          dayOfWeek: this.today.getDay()
        };
        this.setDepartureDay();
      }
      this.setCurrentMonth();
      this.buildCalendar();
      this.showCalendar = true;
    }
  }

  closeCalendar() {
    if (this.showCalendar) {
      this.showCalendar = false;
    }
  }

  buildCalendar() {
    this.weeks = [];
    const DAYS_IN_WEEK = 7;

    this.showBack = this.showBackButton();
    this.showNext = this.showNextButton();

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

      let className = currentDay === this.departureDate.day
                        && this.currentMonth.num === this.departureDate.month
                        && this.currentMonth.year === this.departureDate.year ? 'monthday selectedday' : 'monthday';

      let disabled = currentDay < this.today.getDate()
                        && this.currentMonth.num === this.today.getMonth()
                        && this.currentMonth.year === this.today.getFullYear();

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
    this.currentMonth = { num: this.departureDate.month, year: this.departureDate.year, name: this.yearMonths[this.departureDate.month] };
  }

  setDepartureDay() {
    let month = this.formatZeroAhead(this.departureDate.month + 1);
    let date = this.formatZeroAhead(this.departureDate.day);
    let day = this.weekDays[this.departureDate.dayOfWeek];
    this.departureDay = `${day} ${date}/${month}`;
  }

  formatZeroAhead(num: number) {
    return num < 10 ? `0${num}`  : `${num}`;
  }

  showBackButton() {
    return this.currentMonth.num > this.today.getMonth() && this.currentMonth.year === this.today.getFullYear()
            || this.currentMonth.num <= this.today.getMonth() && this.currentMonth.year > this.today.getFullYear();
  }

  showNextButton() {
    return this.currentMonth.num >= this.today.getMonth() && this.currentMonth.year === this.today.getFullYear()
            || this.currentMonth.num < this.today.getMonth() && this.currentMonth.year === this.today.getFullYear() + 1;
  }

  onInputClick(event: MouseEvent) {
    event.preventDefault();
    this.openCalendar();
  }

  onDaySelected(event: MouseEvent, day: Day) {
    event.preventDefault();
    if (!day.disabled) {
      this.departureDate = day;
      this.setDepartureDay();
      this.closeCalendar();
    }
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

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.closeCalendar();
    }
  }

}
