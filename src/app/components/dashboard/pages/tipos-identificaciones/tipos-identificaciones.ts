import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

type TipoIdRow = { descripcion: string };

@Component({
  selector: 'app-tipos-identificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipos-identificaciones.html',
  styleUrl: './tipos-identificaciones.scss'
})
export class TiposIdentificaciones {
  private fb = inject(FormBuilder);

  DESC_MAX = 100; 

  form = this.fb.group({
    descripcion: [''],
  });

  tipos: TipoIdRow[] = [];

  onDescripcionInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const recortado = input.value.slice(0, this.DESC_MAX);
    if (recortado !== input.value) {
      input.value = recortado;
      this.form.controls.descripcion.setValue(recortado, { emitEvent: false });
    }
  }

  agregar() {
    const { descripcion } = this.form.value;
    this.tipos.push({ descripcion: (descripcion ?? '') as string });
    this.form.reset();
  }

  editar(i: number) {
    const r = this.tipos[i];
    this.form.setValue({ descripcion: r.descripcion });
  }

  eliminar(i: number) {
    this.tipos.splice(i, 1);
  }
}
