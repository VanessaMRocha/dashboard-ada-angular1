import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, MainPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private translate: TranslateService
  ) {
    this.translate.addLangs(['pt-br', 'pt-pt']);
    this.translate.setFallbackLang(environment.defaultLang);
    this.translate.use(environment.defaultLang);
  }
}