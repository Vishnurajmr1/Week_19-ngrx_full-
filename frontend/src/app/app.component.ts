import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  admin=false;
  title = 'frontend';

  ngOnInit(): void {
    
  }

  ngDoCheck(): void {
    const adminStatus = localStorage.getItem('admin');
    this.admin = adminStatus === 'true' ? true : false 
  }
}
