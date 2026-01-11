import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

import { ProductService } from '../../../core/services/product.service';


@Component({
  selector: 'app-financial-products-create',
  standalone: false,
  templateUrl: './financial-products-create.component.html',
  styleUrl: './financial-products-create.component.css',
})
export class FinancialProductsCreateComponent implements OnInit {
  isEditMode: boolean = false;
  loading: boolean = false;
  productId!: string;
  todayDate!: string;

  productForm!: FormGroup;

  errorMessages: any = {
    id: {
      required: 'ID no válido!',
      minlength: 'El ID debe tener al menos 3 caracteres',
      maxlength: 'El ID no puede superar los 10 caracteres',
      idExists: 'Este ID ya está registrado'
    },
    name: {
      required: 'Este campo es obligatorio',
      minlength: 'El nombre debe tener mínimo 6 caracteres',
      maxlength: 'El nombre no puede superar los 100 caracteres',
    },
    description: {
      required: 'Este campo es obligatorio',
      minlength: 'La descripción debe tener al menos 10 caracteres',
      maxlength: 'La descripción no puede superar los 200 caracteres',
    },
    logo: {
      required: 'Este campo es obligatorio',
    },
    date_release: {
      required: 'Este campo es obligatorio',
    },
    date_revision: {
      required: 'Este campo es obligatorio',
    },
  };

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private productService: ProductService,
    ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.productId;
    this.todayDate = new Date().toISOString().substring(0, 10);

    this.buildForm();
    this.listenReleaseDateChanges();

    if (this.isEditMode) {
      // this.loadProduct(this.productId); TODO: implementar getOne en back
      this.productForm.get('id')?.disable();
    }
  }

  private buildForm() {
    this.productForm = this.fb.group({
      id: [ '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        this.existIdValidator(),
      ],
      name: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],
      description: ['',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ],
      logo: ['', Validators.required],
      //TODO: ERROR - AGREGAR VALIDACIÓN DE LA FECHA
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    })
  }

  private listenReleaseDateChanges(): void {
    //escucha el cambio de valor en releaseDate y coloca automáticamente el valor de reviewDate
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (!value) return;

      const releaseDate = new Date(value);
      const reviewDate = new Date(releaseDate);
      reviewDate.setFullYear(releaseDate.getFullYear() + 1);

      this.productForm.get('date_revision')?.setValue(
        reviewDate.toISOString().substring(0, 10),
        { emitEvent: false }
      );
    });
  }

  getErrorsByControl(controlName: string): string[] {
    const control = this.productForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return [];
    }

    const errors = control.errors;

    return Object.keys(errors).map(errorKey => {
      return this.errorMessages[controlName]?.[errorKey] || 'Campo inválido';
    });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const product = this.productForm.getRawValue();

    const request$ = this.isEditMode
      ? this.productService.update(this.productId, product)
      : this.productService.save(product);

    //TODO: ERROR - REVISAR LOADING NO SE CAMBIA A FALSE HASTA QUE SE HACE APLICA ONCHANGE DE INPUT

    request$.subscribe({
      next: () => {
        this.loading = false;
        alert(this.isEditMode ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      },
      error: () => {
        console.log("el loading: ",this.loading)
        this.loading = false;
        alert('Ocurrió un error al guardar');
        console.log("loading despues dle alert:", this.loading);
      }
    });
  }

  resetForm(): void {
    this.productForm.reset();
  }


  // ----- INIT VALIDATORS ---
  existIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      if (!control.value || this.isEditMode) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap((id: string) =>
          this.productService.verify(id).pipe(
            map(exists => exists ? { idExists: true } : null)
          )
        ),
        catchError(() => of(null))
      );
    };
  }
  // ----- END VALIDATORS ---
}
