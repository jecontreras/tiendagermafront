import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './modules/admin/components/components.module';

import { AppComponent } from './app.component';
import { MyOwnCustomMaterialModule } from './app.material.module';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './modules/admin/layouts/admin-layout/admin-layout.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { AutoGeneratedComponent } from './auto-generated/auto-generated.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { OwlModule } from 'ngx-owl-carousel';


@NgModule({
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RecaptchaModule,
    OwlModule,
    FlexLayoutModule,
    MyOwnCustomMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    MainComponent,
    LoginComponent,
    RegistryComponent,
    AutoGeneratedComponent,
  ],
  providers: [
    // {
    //   provide: LOCALE_ID,
    //   useValue: 'es'
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
