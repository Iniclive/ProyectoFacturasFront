import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-component',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.css',
})
export class LoadingComponent {

  loadingService = inject(LoadingService);
}
