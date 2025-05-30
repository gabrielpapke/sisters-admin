import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../components/header/header.component';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-config',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective | null =
    null;

  private tokenService = inject(TokenService);
  private initialValues = this.tokenService.getData();
  private snackBar = inject(MatSnackBar);

  configForm = new FormGroup({
    user_token: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    secret_key: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  ngOnInit() {
    this.configForm.patchValue(this.initialValues);
  }

  onCleanData(event: Event) {
    event.preventDefault();

    this.configForm.reset();
    this.formGroupDirective?.resetForm();
    this.tokenService.cleanData();

    this.openSnackBar('Os dados foram limpos');
  }

  openSnackBar(message: string) {
    this.snackBar.open(message);
  }

  onSubmit() {
    this.tokenService.saveData(this.configForm.value);
    this.openSnackBar('Salvo com sucesso');
  }
}
