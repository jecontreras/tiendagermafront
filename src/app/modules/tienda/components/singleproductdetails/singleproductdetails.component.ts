import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolsService } from './../../../../services/tools.service';
import { FactoryModelService } from './../../../../services/factory-model.service';
import { ProductoService } from './../../../../services/producto';

@Component({
  selector: 'app-singleproductdetails',
  templateUrl: './singleproductdetails.component.html',
  styleUrls: ['/singleproductdetails.component.scss']
})
export class SingleproductdetailsComponent implements OnInit {
  public data: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _producto: ProductoService,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {

  }
  ngOnInit(){
    this.route.params.subscribe(params => {
      // console.log(params);
       if(params['id']!=null){
        this.getlist(params['id']);
      }else{
        this.router.navigate(['../']);
      }
    });
  }
  getlist(id:any){
    if(id){
      return this._producto.get({
        where:{
          slug: id
        }
      })
      .subscribe(
        (res: any)=>{
          console.log(res);
          res = res.data[0];
          if(res){
            this.data = res;
          }else{
            // this.router.navigate(['../']);
          }
        }
      )
      ;
    }else{
      this.router.navigate(['../']);
    }
  }
}
