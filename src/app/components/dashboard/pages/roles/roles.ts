import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

type RolRow = { nombre: string; descripcion?: string };

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles {
  private fb = inject(FormBuilder);

  NOMBRE_MAX = 100;
  DESC_MAX   = 500;

  // Sin validaciones extra: solo controles
  form = this.fb.group({
    nombre: [''],
    descripcion: [''],
  });

  roles: RolRow[] = []; // tabla inicia vacía

  // Respetar espacios; SOLO recortar al límite mientras escribe
  onNombreInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const recortado = input.value.slice(0, this.NOMBRE_MAX);
    if (recortado !== input.value) {
      input.value = recortado;
      this.form.controls.nombre.setValue(recortado, { emitEvent: false });
    }
  }

  onDescripcionInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const recortado = input.value.slice(0, this.DESC_MAX);
    if (recortado !== input.value) {
      input.value = recortado;
      this.form.controls.descripcion.setValue(recortado, { emitEvent: false });
    }
  }

  agregar() {
    const { nombre, descripcion } = this.form.value;
    this.roles.push({
      nombre: (nombre ?? '') as string,
      descripcion: (descripcion ?? '') as string,
    });
    this.form.reset();
  }

  editar(i: number) {
    const r = this.roles[i];
    this.form.setValue({
      nombre: r.nombre,
      descripcion: r.descripcion || '',
    });
  }

  eliminar(i: number) {
    this.roles.splice(i, 1);
  }
}
