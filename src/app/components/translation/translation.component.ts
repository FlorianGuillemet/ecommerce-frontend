import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
   }

  ngOnInit(): void {
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

}
