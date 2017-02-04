import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlyPickerComponent } from './fly-picker.component';

@NgModule({
    imports: [ CommonModule ],
    declarations: [ FlyPickerComponent ],
    exports: [ FlyPickerComponent ]
})
export class FlyPickerModule {}
