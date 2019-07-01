import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['/contact.component.scss']
})
export class ContactComponent implements OnInit {
  public slug: any = {};
  public data: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.data = {};
  }
  ngOnInit(){
    this.route.params.subscribe(params => {
       if(params['id']!=null){
         this.slug = params['id'];
         console.log(params);
       }else{
         
       }
    });
  }
}
