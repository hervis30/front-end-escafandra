import { Component } from '@angular/core';

// material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Generic } from '../../domain/generic';

import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicalService } from '../../service/medical.service';
import { Medicine } from '../../domain/medicine';

@Component({
  selector: 'app-generic',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent {

  public medicine: Medicine[] = [];
  public displayedColumns: string[] = ['Id', 'Name', 'Description', 'Stock', 'Generic', 'Action']

  constructor(private service: MedicalService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.list();
  }

  list(): void {
    this.service.list()
      .subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.medicine = data;

          }
        },
        error: (err) => {
          console.log(err.message)
        }
      })
  }

  getGenericsNames(generics: Generic[]): string {
    return generics?.map(g => g.Name).join(', ') || '';
  }

  edit(medicine: Medicine): void {
    this.router.navigate(['/medicine', medicine.Id])
  }

  new(): void {
    this.router.navigate(['/medicine', 0])
  }

  downloadExcel(): void {
    this.service.exportToExcel().subscribe({
      next: (blob: Blob) => {

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = 'medicamentos.xlsx';
        a.click();

        URL.revokeObjectURL(objectUrl);

        this.snackBar.open('Archivo Excel descargado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Error al descargar Excel:', err);
        this.snackBar.open('Error al descargar el archivo Excel', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  downloadPdf(): void {
    this.service.exportToPdf().subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = 'medicamentos.pdf';
        a.click();

        URL.revokeObjectURL(objectUrl);

        this.snackBar.open('Archivo PDF descargado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        this.snackBar.open('Error al descargar el archivo PDF', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  remove(medicine: Medicine): void {
    if (confirm("Desea eliminar el medicamento " + medicine.Name))

      this.service.delete(medicine)
        .subscribe({
          next: (data) => {
            if (data) {
              this.snackBar.open('medicamento eliminado con éxito', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.list();
            } else {
              this.snackBar.open('No se pudo eliminar el medicamento', 'Cerrar', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (err) => {
            this.snackBar.open('Error al eliminar: ' + err.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        })
  }
  generic(): void {
    this.router.navigate(['/generics'])
  }


}
