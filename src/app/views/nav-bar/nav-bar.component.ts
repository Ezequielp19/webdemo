import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../common/services/auth.service';
import { FirestoreService } from '../../common/services/firestore.service';
import { Categoria } from '../../common/models/categoria.model';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Producto } from 'src/app/common/models/producto.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class GlobalHeaderComponent implements OnInit {
  productosFiltrados: Producto[] = [];
  isSearching: boolean = false; // Nueva variable de estado
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  user$: Observable<any | null> = this.authService.user$;

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categorias = await this.firestoreService.getCategorias();
      console.log('Categorías:', this.categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  }

  onCategoriaClick(categoriaId: string) {
    this.router.navigate(['/certificacion', { categoriaId: categoriaId }]);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Se ha cerrado la sesión',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  navigateTologin() {
    this.router.navigate(['/login']);
  }

  search(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.trim() === '') {
      this.productosFiltrados = [];
      this.isSearching = false;
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query)
      );
      this.isSearching = true;
    }
  }
}
