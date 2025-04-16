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
import { MedicalService } from '../../service/medical.service';
import { Medicine } from '../../domain/medicine';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-generic',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css'
})
export class MedicineComponent implements OnInit {

  public action: boolean = false;
  public formGroup!: FormGroup;
  public generics: Generic[] = [];

  constructor(private service: MedicalService,
    private serviceGeneric: GenericService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      Id: [0],
      Name: [null, [Validators.required]],
      Description: [null, [Validators.required]],
      Stock: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      Generics: [[]]
    });

    this.init();
    this.list();
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

                  //this.formGroup.patchValue(data)
                  this.formGroup.patchValue({
                    ...data,
                    Generics: data.Generics?.map(g => g.Id) || []
                  });
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

  list(): void {
    this.serviceGeneric.list()
      .subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.generics = data;
          }
        },
        error: (err) => {
          console.log(err.message)
        }
      })
  }

  save(): void {
    const model: Medicine = this.formGroup.getRawValue();

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
              this.router.navigate(['/medicines'])
              this.snackBar.open('Medicamento actualizado con éxito', 'Cerrar', {
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
              this.router.navigate(['/medicines'])
              this.snackBar.open('Medicamento creado con éxito', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            }
          },
          error: (err) => {
            this.snackBar.open('Error al crear el medicamento: ' + err.message, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        })
    }

  }

  compareGeneric(o1: any, o2: any): boolean {
    return (o1.Name === o2.Name && o1.Id === o2.Id);
  }

  back(): void {
    this.router.navigate(['/medicines'])
  }

}
