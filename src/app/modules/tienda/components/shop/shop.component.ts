import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['/shop.component.scss']
})
export class ShopComponent implements OnInit {
  public slug: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }
  ngOnInit(){
    this.route.params.subscribe(params => {
       if(params['id']!=null){
         this.slug = params['id'];
         console.log(params);
       }
    });
  }
}
