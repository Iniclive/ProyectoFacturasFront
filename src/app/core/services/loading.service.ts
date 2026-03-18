import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _isLoading = signal(false);
  isLoading = this._isLoading.asReadonly();

  show() { this._isLoading.set(true);
    console.log('Mostrando loading...');
   }
  hide() { this._isLoading.set(false);
    console.log('Ocultando loading...');
  }
}
