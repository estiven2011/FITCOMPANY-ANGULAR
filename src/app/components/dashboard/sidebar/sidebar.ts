import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})

export class Sidebar {

  menu: MenuItem[] = [
    { label: 'Overview',    icon: 'LayoutDashboard',         link: 'dashboard' },
    { label: 'Compras',     icon: 'ShoppingCart', link: 'compras' },
    { label: 'Ventas',      icon: 'ShoppingBasket', link: 'ventas' },
    { label: 'Categorías',  icon: 'ChartBarStacked',     link: 'categorias' },
    { label: 'Formulario',  icon: 'BookText',     link: 'formularios' },

    // 🔹 Lo que pediste:
    { label: 'Roles',       icon: 'UserCog',      link: 'roles' },
    { label: 'Perfiles',    icon: 'IdCard',       link: 'perfiles' },
    { label: 'Unidades',    icon: 'Ruler',        link: 'unidades' },

    { label: 'Permisos',    icon: 'ShieldCheck',  link: 'permisos' },
  ];
}
