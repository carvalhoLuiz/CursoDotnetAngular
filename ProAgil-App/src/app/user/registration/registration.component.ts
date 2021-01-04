import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/_models/User';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  user: User;

  constructor(
              private authService: AuthService,
              public router: Router,
              public fb: FormBuilder,
              private toastr: ToastrService
              ) { }

  ngOnInit(): void {
    this.validation();
  }

  validation(): void {
    this.registerForm = this.fb.group({
      fullName : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      userName : ['', Validators.required],
      passwords: this.fb.group({
        password : ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.compararSenhas })
    });
  }

  compararSenhas(fb: FormGroup): void {
    const confirmSenhaCtrl = fb.get('confirmPassword');
    if (confirmSenhaCtrl?.errors === null || 'mismatch' in confirmSenhaCtrl!.errors){
      if (fb.get('password')?.value !== confirmSenhaCtrl?.value) {
        confirmSenhaCtrl?.setErrors({ mismatch: true });

      } else {
        confirmSenhaCtrl?.setErrors(null);
      }
    }
  }

  cadastrarUsuario(): void{
    if (this.registerForm.valid) {
      this.user = Object.assign({password: this.registerForm!.get('passwords.password')!.value}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastrado com sucesso!');
        }, (error: any) => {
          const erro = error.error;
          erro.forEach((element: any) => {
            switch (element.code) {
              case 'Duplicate':
                this.toastr.error('Cadastro Duplicado');
                break;

              default:
                this.toastr.error(`Erro no cadastro! code: ${element.code}`);
                break;
            }
          });
        }
        );
    }
  }
}
