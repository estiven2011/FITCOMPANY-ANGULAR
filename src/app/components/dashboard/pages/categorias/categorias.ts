import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoriasService } from '../../../../shared/services/categorias.service';
import { Categoria } from '../../../../shared/models/categoria.model';

@Component({
  standalone: true,
  selector: 'app-categorias',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss'
})
export class Categorias implements OnInit {
  private fb = inject(FormBuilder);
  private categoriasSrv = inject(CategoriasService);

  rows: Categoria[] = [];
  loadingList = false;
  saving = false;
  okMsg = '';
  errorMsg = '';

  // Form
  form = this.fb.nonNullable.group({
    nombre_categoria: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion_categoria: ['', [Validators.maxLength(255)]],
  });

  // === Estado de edición ===
  editando = false;
  private editId: number | null = null;

  ngOnInit(): void {
    console.log('[Categorias] ngOnInit');
    this.loadData();
  }

  loadData() {
    console.log('[Categorias] loadData() START');
    this.loadingList = true;
    this.categoriasSrv.listar().subscribe({
      next: (rows) => {
        console.log('[Categorias] listar() OK, rows=', rows);
        this.rows = rows || [];
        this.loadingList = false;
      },
      error: (e) => {
        console.log('[Categorias] listar() ERROR', e);
        this.errorMsg = 'Error cargando categorías';
        this.loadingList = false;
      }
    });
  }

  // --- Crear / Actualizar ---
  submit() {
    if (this.saving) return;

    // Sanitizar como lo tenemos
    const nombre = (this.form.value.nombre_categoria || '').trim().replace(/\s+/g, ' ');
    const desc = (this.form.value.descripcion_categoria || '').trim().replace(/\s+/g, ' ');

    // Validaciones (las que ya tienes)
    if (!nombre) { this.errorMsg = 'El nombre es obligatorio.'; return; }
    const PATRON = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-.]+$/;
    if (!PATRON.test(nombre)) { this.errorMsg = 'El nombre solo puede contener letras, espacios, guiones y puntos.'; return; }
    if (nombre.length > 100) { this.errorMsg = 'El nombre admite máximo 100 caracteres.'; return; }
    if (desc.length > 200) { this.errorMsg = 'La descripción admite máximo 200 caracteres.'; return; }

    this.saving = true;
    this.okMsg = '';
    this.errorMsg = '';

    const body = { nombre_categoria: nombre, descripcion_categoria: desc };

    const req$ = (this.editando && this.editId != null)
      ? this.categoriasSrv.actualizar(this.editId, body)
      : this.categoriasSrv.crear(body);

    req$
      .pipe(finalize(() => {
        // SIEMPRE se ejecuta, éxito o error
        this.saving = false;
        setTimeout(() => { this.okMsg = ''; this.errorMsg = ''; }, 3000);
      }))
      .subscribe({
        next: (res) => {
          this.okMsg = res?.message || (this.editando ? 'Actualizado correctamente.' : 'Guardado correctamente.');
          this.loadData();
          // reset de edición + form
          this.editando = false;
          this.editId = null;
          this.form.reset({ nombre_categoria: '', descripcion_categoria: '' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (e) => {
          // ejemplo: “Ya existe una categoría con ese nombre.”
          this.errorMsg = e?.error?.message || 'Error al guardar la categoría.';
        }
      });
  }


  // --- Editar: precarga el form y activa modo edición ---
  editar(c: Categoria) {
    this.editando = true;
    this.editId = c.id_categoria ?? null;
    this.form.patchValue({
      nombre_categoria: c.nombre_categoria ?? '',
      descripcion_categoria: c.descripcion_categoria ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.editando = false;
    this.editId = null;
    this.form.reset({
      nombre_categoria: '',
      descripcion_categoria: ''
    });
  }

  // --- Eliminar ---
  eliminar(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar esta categoría?');
    if (!confirmar) return;

    this.categoriasSrv.eliminar(id).subscribe({
      next: (res) => {
        console.log('[Categorias] eliminar() OK', res);
        this.okMsg = res?.message || '✅ Categoría eliminada correctamente.';
        this.loadData();
      },
      error: (e) => {
        console.log('[Categorias] eliminar() ERROR', e);
        // si luego el back devuelve 409 con detalle, aquí lo manejamos
        this.errorMsg = e?.error?.message || 'Error eliminando';
      }
    });
  }
}
