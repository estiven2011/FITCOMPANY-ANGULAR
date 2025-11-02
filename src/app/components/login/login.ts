import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // ✅ Usamos inject() para evitar el problema de inicialización
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hide = true;
  saving = false;
  errorMsg = '';

  // ✅ Sin minLength; mismo comportamiento que tu React
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMsg = '';

    // ✅ AuthService.login espera { correo, password }
    const body = {
      correo: this.form.value.email,
      password: this.form.value.password,
    };

    this.auth.login(body as any).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error al iniciar sesión';
        this.saving = false;
      },
    });
  }
}
