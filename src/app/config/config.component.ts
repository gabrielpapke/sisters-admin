import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  private tokenService = inject(TokenService);
  private initialValues = this.tokenService.getData();

  configForm = new FormGroup({
    user_token: new FormControl(this.initialValues.user_token, {
      nonNullable: true,
      validators: Validators.required,
    }),
    secret_key: new FormControl(this.initialValues.secret_key, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  onSubmit() {
    console.warn(this.configForm.value);

    if (this.configForm.invalid) {
      return alert('form invalido');
    }

    this.tokenService.saveData(this.configForm.value);
  }
}
