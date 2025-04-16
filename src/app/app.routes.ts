import { Routes } from '@angular/router';
import { GenericsComponent } from './module-app/modules/generic/generics.component';
import { GenericComponent } from './module-app/modules/generic/generic.component';
import { MedicinesComponent } from './module-app/modules/medicine/medicines.component';
import { MedicineComponent } from './module-app/modules/medicine/medicine.component';

export const routes: Routes = [
    // { path: '', component: GenericsComponent },
    { path: '', component: GenericsComponent },
    { path: 'generics', component: GenericsComponent },
    { path: 'generic/:id', component: GenericComponent },
    { path: 'medicines', component: MedicinesComponent },
    { path: 'medicine/:id', component: MedicineComponent },
];


