import {Component, OnInit} from '@angular/core';
import {Client} from '../../models/Client';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {ClientService} from '../../services/client.service';
import {SettingsService} from '../../services/settings.service';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  client: Client = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    balance: 0
  };
  disableBalanceOnAdd: Boolean = true;

  constructor(public fms: FlashMessagesService,
              public router: Router,
              public clientService: ClientService,
              public settings: SettingsService) {
  }

  ngOnInit() {
    this.disableBalanceOnAdd = this.settings.getSettings().disableBalanceOnAdd;
  }

  onSubmit({value, valid}: {
    value: Client, valid: Boolean
  }) {
    if (this.disableBalanceOnAdd) {
      value.balance = 0;
    }
    if (!valid) {
      this.fms.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 4000});
      this.router.navigate(['add-client']);
    } else {
      this.clientService.newClient(value);
      this.fms.show('New client added', {cssClass: 'alert-success', timeout: 4000});
      this.router.navigate(['/']);
    }
  }

}
