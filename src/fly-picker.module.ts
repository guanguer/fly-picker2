import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlyPickerComponent } from './fly-picker.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarService } from './shared/calendar.service';

@NgModule({
    declarations: [ FlyPickerComponent, CalendarComponent ],
    imports: [ CommonModule ],
    providers: [ CalendarService ],
    exports: [ FlyPickerComponent ]
})
export class FlyPickerModule {}
