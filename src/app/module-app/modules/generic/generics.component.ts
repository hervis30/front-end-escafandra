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

@Component({
  selector: 'app-generic',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './generics.component.html',
  styleUrl: './generics.component.css'
})
export class GenericsComponent {

  public generic: Generic[] = [];
  public displayedColumns: string[] = ['Id', 'Name', 'Description', 'Action']

  constructor(private service: GenericService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.list();
  }

  list(): void {
    this.service.list()
      .subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.generic = data;
          }
        },
        error: (err) => {
          console.log(err.message)
        }
      })
  }

  edit(generic: Generic): void {
    this.router.navigate(['/generic', generic.Id])
  }

  new(): void {
    this.router.navigate(['/generic', 0])
  }

  remove(generic: Generic): void {
    if (confirm("Desea eliminar el estado " + generic.Name))

      this.service.isGenericInUse(generic.Id)
        .subscribe({
          next: (data) => {
            if (!data) {
              this.removeConfirm(generic);
            } else {
              this.snackBar.open('No se pudo eliminar el genérico, esta asociado a un medicamento', 'Cerrar', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
              return;
            }
          },
          error: (err) => {
            this.snackBar.open('Error al eliminar: ' + err.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });


  }

  removeConfirm(generic: Generic): void {
    this.service.delete(generic)
      .subscribe({
        next: (data) => {
          if (data) {
            this.snackBar.open('Génerico eliminado con éxito', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.list();
          } else {
            this.snackBar.open('No se pudo eliminar el genérico', 'Cerrar', {
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
      });
  }

  medicine(): void {
    this.router.navigate(['/medicines'])
  }

}
