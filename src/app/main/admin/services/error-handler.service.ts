import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
  status_code: number;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  snackBar = inject(MatSnackBar);

  handleValidationError(validationError: ValidationError): void {
    const detailedErrors = Object.entries(validationError.errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');

    console.error('Erro de validação:', detailedErrors);

    this.snackBar.open(
      'Erro de validação nos dados enviados. Confira os detalhes.',
      'Fechar',
      {
        duration: 5000,
      }
    );
  }
}
