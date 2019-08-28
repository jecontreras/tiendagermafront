import { Component, OnInit, ChangeDetectionStrategy, DoCheck } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FactoryModelService } from './../../services/factory-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { ToolsService } from './../../services/tools.service';
import { departamento } from '../../Json/departamentos';
import { paises } from '../../Json/paises';
import * as _ from 'lodash';
import swal from 'sweetalert';
@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss'],
  providers: [UserService]
})
export class RegistryComponent implements OnInit {
  private response: any;
  public cabeza: string;
  public disabled = false;
  public disabledcabeza = true;
  public disabledusername = true;
  public disabledemail = true;
  public disabledpassword = true;
  public disabledPassCount = true;
  public btsdisabled: any;
  public panelOpenState = false;
  public verificacion = false;
  public disabledpais = false;
  public listdepartamento: any = [];
  public listciudades: any = [];
  public listpais: any = [];
  public politicas: string;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  public logead: boolean = false;
  public app: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activate: ActivatedRoute,
    private userService: UserService,
    private _authSrvice: AuthService,
    private _tools: ToolsService,
    private _model: FactoryModelService
  ) {
    this.app = this._model.app;
    if (this._authSrvice.isLoggedIn()) {
      this.router.navigate(['admin']);
    }
    this.cabeza = (this.activate.snapshot.paramMap.get('username'));
    this.politicas = '';
    // console.log(this.cabeza);
  }

  ngOnInit() {
    if(localStorage.getItem('user')){
      this.logead = true;
    }
    this.listdepartamento = departamento;
    this.listpais = paises;
    // console.log(this.listdepartamento);
    this.registerForm = this.formBuilder.group({
      tipocuenta: [false],
      nameempresa: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      lastname: [''],
      email: ['', Validators.required],
      celular: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirpassword: ['', [Validators.required, Validators.minLength(6)]],
      pais: ['Colombia'],
      empresa: ['5d19916d2a7f6f334499d396'],
      departamento: [''],
      ciudad: [''],
      direccion: [''],
      ofreceempresa: [''],
      aceptarpoliticas: ['h', [Validators.required]]
    });
    this.viewpais();
  }
  validadUsername() {
    // console.log(this.registerForm.value);
    const
      data: any = this.registerForm.value
      ;
    this.disabledusername = true;
    if (data.username) {
      // console.log(data.username.replace(/ /g, ""));
      this.registerForm.patchValue({ username: data.username.replace(/ /g, '') });
      this.userService.cabeza(data.username)
        .subscribe(
          (res: any) => {
            res = res.data[0];
            // console.log(res);
            if (res) {
              this.disabledusername = false;
            }
          }
        )
        ;
    }
  }
  validadEmail() {
    const
      data: any = this.registerForm.value
      ;
    this.disabledemail = true;
    if (data.email) {
      const
        filtro: any = data.email.split('@', '2')
        ;
      // console.log(filtro);
      if (filtro[1] !== 'gmail.com') {
        this.disabledemail = false;
      }
    }
  }
  validadPassword(opt: any) {
    const
      data: any = this.registerForm.value
      ;
    this.disabledpassword = true;
    this.disabledPassCount = true;
    if (!opt) {
      if (data.password !== data.confirpassword) {
        this.disabledpassword = false;
      }
    } else {
      // console.log(data.password.length);
      if (data.password.length <= 6) {
        this.disabledPassCount = false;
      }
    }
  }

  blurdepartamento() {
    // console.log(this.registerForm.value);
    const data: any = this.registerForm.value;
    let idx: any = 0;
    idx = _.findIndex(this.listdepartamento, ['departamento', data.departamento]);
    // console.log(idx);
    if (idx > -1) {
      // console.log(this.listdepartamento[idx]);
      this.listciudades = this.listdepartamento[idx].ciudades;
    }
  }

  viewpais() {
    const
      data: any = this.registerForm.value
      ;
    // console.log(data);
    this.disabledpais = true;
    if (data.pais === 'Colombia') {
      this.disabledpais = false;
    }

  }


  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  onSubmit() {
    // console.log(this.registerForm.value, this.disabledemail, this.disabledusername);
    if (this.disabledemail && this.disabledusername && this.registerForm.value.departamento && this.registerForm.value.pais
      && this.registerForm.value.ciudad && this.registerForm.value.password === this.registerForm.value.confirpassword) {
        this.logead = !this.logead;
      this.userService.register(this.registerForm.value).subscribe(
        (response: any) => {
          // console.log(response);
          if (response.status === 200) {
            this.verificacion = true;
            if(this.registerForm.value.tipocuenta){
              swal('Ok!',
              'Registro! Estas En Modo de Aprobacion esta Funciona Tardara Maximo 2 Dias En Activar Tu Cuenta: '
              + this.registerForm.value.nameempresa, 'success');
            }else{
              swal('Ok!',
              // 'Registro completo! Falta Que Actives Tu Cuenta En Gmail Te Enviamos Un Correo de Verificacion a Tu Email: '
              'Registrado '
              + this.registerForm.value.email, 'success');
            }
            if(response.data.empresa){
              response.data.objempresa = response.data.empresa;
              response.data.empresa = response.data.empresa.id;
            }
            localStorage.setItem('user', JSON.stringify(response.data));
            this.router.navigate(['admin']);
          } else {
            this.logead = false;
            swal('Error!', 'No se pudo registrar  revisa los datos ingresados o prueba un nombre de usuario diferente!', 'error');
          }
        },
        error => {
          this.logead = false;
          swal('Error!', 'Los datos son incorrectos o el usuario ya existe!', 'error');
        }
      );
    } else {
      this.logead = false;
      swal('Error!', 'Por Favor Mirar Los Errores que Salen en El Formulario y Llenarlos Todos Para Continuar Gracias!', 'error');
    }
  }

  resolved(obj: any) {
    let value: any = false;
    const registre: any = this.registerForm.controls.aceptarpoliticas;
    if (obj) {
      this.btsdisabled = obj;
    }
    if (!this.registerForm.controls.aceptarpoliticas.value || this.registerForm.controls.aceptarpoliticas.value === 'h') {
      value = !value;
      registre.value = true;
      // this.registerForm.setValue({aceptarpoliticas: false});
    }
    if (value && this.btsdisabled) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
}
