import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'login';
  model: any = {};
  constructor(private authService: AuthService,
              public router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.authService.login(this.model).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
        this.toastr.success('logado com sucesso!');
      },
      (error: any) => {
        this.toastr.error('falha ao tentar logar');
      }
    );
  }




}
