import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './pagenotfound.component.html',
})
export class PagenotfoundComponent {

}
