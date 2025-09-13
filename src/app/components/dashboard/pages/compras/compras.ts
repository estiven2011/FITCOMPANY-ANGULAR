import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.scss',
})
export class Compras {
  private fb = inject(FormBuilder);
  private today = new Date().toISOString().slice(0, 10);

  // ---- validadores ----
  private maxDigitsValidator(max: number): ValidatorFn {
    return (ctrl: AbstractControl) => {
      const digits = (ctrl.value ?? '').toString().replace(/\D/g, '');
      return digits.length > 0 && digits.length <= max ? null : { maxdigits: true };
    };
  }

  private positiveValidator(): ValidatorFn {
    return (ctrl: AbstractControl) => {
      const n = this.unmask(ctrl.value);
      return n > 0 ? null : { nonpositive: true };
    };
  }

  form = this.fb.group({
    producto: ['', [Validators.required]],
    cantidad: ['', [Validators.required, this.maxDigitsValidator(6), this.positiveValidator()]],
    costoUnitario: ['', [Validators.required, this.maxDigitsValidator(8), this.positiveValidator()]],
    fecha: [this.today, [Validators.required]],
  });

  // Tabla (placeholder sin back)
  rows: Array<{
    id: number;
    producto: string;
    cantidad: number;
    costoUnitario: number;
    fecha: string; // yyyy-MM-dd
    usuario: string;
  }> = [];

  // ---- máscara de miles y límite de dígitos ----
  onInputMasked(controlName: 'cantidad' | 'costoUnitario', max: number, ev: Event) {
    const input = ev.target as HTMLInputElement;
    // 1) Solo dígitos
    let digits = input.value.replace(/\D/g, '');
    // 2) Limita cantidad de dígitos
    if (digits.length > max) digits = digits.slice(0, max);
    // 3) Formatea con puntos de miles
    const formatted = this.formatWithDots(digits);
    // 4) Pinta el valor formateado en el input
    input.value = formatted;
    // 5) Actualiza el control (sin loop de eventos)
    this.form.controls[controlName].setValue(formatted, { emitEvent: false });
  }

  private formatWithDots(digits: string): string {
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private unmask(v: unknown): number {
    const digits = (v ?? '').toString().replace(/\D/g, '');
    return digits ? Number(digits) : 0;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const payload = {
      ...this.form.value,
      cantidad: this.unmask(this.form.value.cantidad),
      costoUnitario: this.unmask(this.form.value.costoUnitario),
    };

    console.log('Compra a registrar (UI):', payload);
    // TODO: POST al backend y refrescar tabla
  }
}
