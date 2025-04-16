import { Component, OnInit } from '@angular/core';

// material
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Generic } from '../../domain/generic';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-generic',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './generic.component.html',
  styleUrl: './generic.component.css'
})
export class GenericComponent implements OnInit {

  public action: boolean = false;
  public formGroup!: FormGroup;

  constructor(private service: GenericService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      Id: [0],
      Name: [null, [Validators.required]],
      Description: [null, [Validators.required]]
    });

    this.init()
  }

  init(): void {
    this.activateRoute.params
      .subscribe(parameter => {
        if (parameter['id'] != 0) {
          this.action = true;
          this.service.read(parameter['id'])
            .subscribe({
              next: (data) => {
                if (data) {
                  this.formGroup.patchValue(data)
                }
              },
              error: (err) => {
                console.log(err.message);
              }
            })
        } else {
          this.action = false;
        }
      })
  }

  save(): void {
    const model: Generic = this.formGroup.getRawValue();

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('Debe diligenciar los campos obligatorios: ', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;

    }

    if (this.action) {
      this.service.update(model)
        .subscribe({
          next: (data) => {
            if (data) {
              this.router.navigate(['/generics'])
              this.snackBar.open('Génerico actualizado con éxito', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            }
          },
          error: (err) => {
            this.snackBar.open('Error al actualizar: ' + err.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        })
    } else {
      this.service.create(model)
        .subscribe({
          next: (data) => {
            if (data) {
              this.router.navigate(['/generics'])
              this.snackBar.open('Génerico creado con éxito', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            }
          },
          error: (err) => {
            this.snackBar.open('Error al crear el génerico: ' + err.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        })
    }

  }

  back(): void {
    this.router.navigate(['/generics'])
  }

}
