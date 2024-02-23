import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, MaterialModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  authService: AuthService = inject(AuthService);
  opened: boolean = true;

  onLogout() {
    this.authService.logout();
  }
}
