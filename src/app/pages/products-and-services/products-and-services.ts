import { MatIcon } from "@angular/material/icon";
import { ConfirmDirective } from "../../core/directives/app-confirm.directive";
import { BotonPropioComponent } from "../../shared/boton-propio/boton-propio.component";
import { DataTableComponent } from "../../shared/data-table/data-table.component";
import { UserDetailSidebarComponent } from "../users/user-detail-sidebar/user-detail-sidebar";
import { Component } from "@angular/core";
import { MaterialService } from "../../core/services/materials.service";
import { MatDialog } from "@angular/material/dialog";
import { DestroyRef, inject, signal } from "@angular/core";
import { ToastService } from "../../core/services/toast.service";
import { ColumnDef, FilterDef } from "../../shared/data-table/data-table.types";
import { Material } from "../../core/models/material.models";
import { ProductServiceDetails } from "./product-service-details/product-service-details";



@Component({
  selector: 'app-products-and-services',
  imports: [MatIcon,
    BotonPropioComponent,
    ConfirmDirective,
    DataTableComponent,
    ProductServiceDetails],
  templateUrl: './products-and-services.html',
  styleUrl: './products-and-services.css',
})
export class ProductsAndServices {
private readonly materialService = inject(MaterialService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  readonly materials = this.materialService.materials;
  readonly error = signal('');

  selectedMaterialId = signal<string | null>(null);

  readonly sidebarOpen = signal(false);

  readonly columns: ColumnDef<Material>[] = [
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'precio', label: 'Precio', sortable: true },
  ];

  readonly filters: FilterDef[] = [
    { kind: 'text', key: 'nombre', label: 'Nombre', icon: 'person', placeholder: 'Nombre material...' },
    { kind: 'range', key: 'precio', label: 'Precio', icon: 'attach_money', placeholder: 'Precio material...' },
  ];

  ngOnInit() {
    this.materialService.cargarMateriales();
  }

  showMaterialDetails(material: Material) {
    this.selectedMaterialId.set(material.idMaterial.toString());
    this.sidebarOpen.set(true);
  }

  createMaterial() {
    this.selectedMaterialId.set(null);
    this.sidebarOpen.set(true);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
    this.selectedMaterialId.set(null);
  }

  deleteMaterial(id: string) {
    this.materialService.deleteMaterial(id).subscribe({
      next: () =>
        this.toastService.mostrar({
          texto: 'Se ha eliminado el material correctamente',
          tipoToast: 'submit',
        }),
      error: () =>
        this.toastService.mostrar({
          texto: 'Error al eliminar el usuario',
          tipoToast: 'delete',
        }),
    });
  }

}
