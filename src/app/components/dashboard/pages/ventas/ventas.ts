import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormArray,
  FormGroup,
} from '@angular/forms';

type LineaVenta = {
  producto: string;     
  cantidad: string;      
  precioUnit: number;    
};

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss',
})
export class Ventas {
  private fb = inject(FormBuilder);

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
    lineas: this.fb.array<FormGroup>([]),
  });

  get lineas(): FormArray<FormGroup> {
    return this.form.controls.lineas as FormArray<FormGroup>;
  }

  private crearLinea(): FormGroup {
    return this.fb.group({
      producto: ['', [Validators.required]],
      cantidad: ['', [Validators.required, this.maxDigitsValidator(6), this.positiveValidator()]],
      precioUnit: [0, [Validators.required]],  
    });
  }

  agregarLinea() {
    this.lineas.push(this.crearLinea());
  }
  eliminarLinea(i: number) {
    this.lineas.removeAt(i);
  }

  onInputMasked(i: number, controlName: 'cantidad', max: number, ev: Event) {
    const input = ev.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '');
    if (digits.length > max) digits = digits.slice(0, max);
    const formatted = this.formatWithDots(digits);
    input.value = formatted;
    this.lineas.at(i).get(controlName)?.setValue(formatted, { emitEvent: false });
  }

  private formatWithDots(digits: string): string {
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  private unmask(v: unknown): number {
    const d = (v ?? '').toString().replace(/\D/g, '');
    return d ? Number(d) : 0;
  }

  subtotal(i: number): number {
    const g = this.lineas.at(i);
    const qty = this.unmask(g.get('cantidad')?.value);
    const pu  = Number(g.get('precioUnit')?.value || 0);
    return qty * pu;
  }

  // Total general
  get total(): number {
    return this.lineas.controls.reduce((acc, g) => {
      const qty = this.unmask(g.get('cantidad')?.value);
      const pu  = Number(g.get('precioUnit')?.value || 0);
      return acc + qty * pu;
    }, 0);
  }

  // Tabla: placeholder
  rows: Array<{ id: number; fecha: string; total: number; usuario: string; }> = [];

  submit() {
    if (this.form.invalid || this.lineas.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.lineas.controls.map(g => ({
      producto: g.get('producto')?.value,
      cantidad: this.unmask(g.get('cantidad')?.value),
      precioUnit: Number(g.get('precioUnit')?.value || 0),
      subtotal: this.unmask(g.get('cantidad')?.value) * Number(g.get('precioUnit')?.value || 0),
    }));

    console.log('Venta a registrar (UI):', { detalle: payload, total: this.total });

  }
}
