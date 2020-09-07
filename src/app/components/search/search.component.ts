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

  search(value: string | null ): void {
    const valueTrim = value.trim();

    if (valueTrim.length >= 3) {
      this.router.navigateByUrl(`/search/${valueTrim}`);
    } else if (valueTrim.length === 0) {
      this.router.navigateByUrl(`/products`);
    }
  }

}
