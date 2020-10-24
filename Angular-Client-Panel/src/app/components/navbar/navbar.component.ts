import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import 'rxjs/add/operator/map';
import { SettingsService} from '../../services/settings.service'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  loggedInUser: string;
  showRegister: boolean;

  constructor(private auth: AuthService,
              private router: Router,
              private fms: FlashMessagesService,
              private settings: SettingsService) {
  }

  ngOnInit() {
    this.auth.getStatus().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
        this.loggedInUser = auth.email;
      } else {
        this.isLoggedIn = false;
      }
    });

    this.showRegister = this.settings.getSettings().allowRegistration;
  }

  onLogoutClick() {
    this.auth.logout();
    this.fms.show('You are logged out!', {cssClass: 'alert-success', timeout: 4000});
    this.router.navigate(['/login']);
  }

}
