import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  search(value: string): void {
    this.router.navigateByUrl(`/search/${value}`);
  }

}
