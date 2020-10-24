import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;

  constructor(private auth: AuthService,
              private router: Router,
              private fms: FlashMessagesService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.auth.register(this.email, this.password)
      .then((res) => {
    this.fms.show('New User Registered', {cssClass: 'alert-success', timeout: 4000});
    this.router.navigate(['/']);
      })
      .catch((err) => {
        this.fms.show(err.message, {cssClass: 'alert-danger', timeout: 4000});
        this.router.navigate(['/register']);
        }
      )
  }
}
