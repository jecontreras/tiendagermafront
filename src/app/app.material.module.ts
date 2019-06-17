import {MatButtonModule,
   MatCheckboxModule,
   MatSidenavModule,
   MatIconModule,
   MatToolbarModule,
   MatListModule,
   MatCardModule,
   MatTooltipModule,
   MatDividerModule,
   MatInputModule,
   MatFormFieldModule,
   MatTableModule,
   MatDatepickerModule,
   MatGridListModule,
   MatTabsModule,
   MatSnackBarModule,
   MatRippleModule,
   MatPaginatorModule,
   MatMenuModule} from '@angular/material';
   import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatDatepickerModule,
    MatGridListModule,
    MatSnackBarModule,
    MatRippleModule,
    MatPaginatorModule,
    MatTabsModule,
    ScrollDispatchModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatDatepickerModule,
    MatGridListModule,
    MatSnackBarModule,
    MatRippleModule,
    MatPaginatorModule,
    MatTabsModule,
    ScrollDispatchModule
  ],
})
export class MyOwnCustomMaterialModule { }
