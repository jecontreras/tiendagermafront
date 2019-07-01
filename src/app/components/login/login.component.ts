import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { ToolsService } from './../../services/tools.service';
import { FactoryModelService } from './../../services/factory-model.service';
import * as _ from 'lodash';
import { GLOBAL } from './../../services/global';
// import swal from 'sweetalert';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user;
  public response: any;
  public url: string;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public reContrasena: boolean = false;
  public returnUrl: string;
  public disabledemail: boolean = true;
  public disabled: any = false;
  public data: any = {};
  // public _publicacion: any;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private _userService: UserService,
      private _authSrvice: AuthService,
      private _tools: ToolsService,
      private _model: FactoryModelService
  ) {
    this.user = {};
    if (this._authSrvice.isLoggedIn()) {
      this.router.navigate(['admin/dashboard']);
    }
    this.url = GLOBAL.url;
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
  }
  validadEmail(){
    const
      data: any = this.data
    ;
    this.disabledemail = true;
    if(data.email){
      const
        filtro: any = data.email.split('@', '2')
      ;
      // console.log(filtro);
      if(filtro[1] !== 'gmail.com'){
        this.disabledemail = false;
      }
    }
  }
  submitCorreo(){
    const
      data: any = this.data
    ;
    this._model.query('user/correo',{
      where:{
        email: data.email
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        if(res.status === 200){
          // swal( 'ok' ,  'Se Te a Enviado una Clave a tu correo!' ,  'success' );
          this.reContrasena = false;
          this.data = {};
        }else{
          // swal( 'Oops' ,  'La Contraseña son incorrectos!' ,  'error' );
        }
        return res;
      }
    );
  }

  get f() { return this.loginForm.controls; }
  resolved(obj) {
    // console.log(obj);
    if (obj) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  onSubmit() {
    if (this.disabled) {
      this._userService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.success) {
            // console.log(response);
            localStorage.setItem('user', JSON.stringify(response.data));
            this.router.navigate(['admin/dashboard']);
          } else {
            // swal( 'Oops' ,  'El usuario o la contraseña son incorrectos!' ,  'error' );
          }
        },
        error => {
          // swal( 'Error' ,  'Problema con el servidor!' ,  'error' );
          console.log(<any>error);
        }
      );
    }
  }

}
