import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../services/client.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Client} from '../../models/Client';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  id: string;
  client: Client;
  hasBalance = false;
  showBalanceUpdateInput = false;

  constructor(public clientService: ClientService,
              public router: Router,
              public route: ActivatedRoute,
              public fms: FlashMessagesService) {
  }

  ngOnInit() {
    // Get ID
    this.id = this.route.snapshot.params['id'];
    // Get client
    this.clientService.getClient(this.id).subscribe(client => {
      if (client.balance > 0) {
        this.hasBalance = true;
      }
      this.client = client;
    });
  }

  updateBalance(id: string) {
    this.clientService.updateClient(this.id, this.client);
    this.fms.show('Balance Updated', {cssClass: 'alert-success', timeout: 4000});
    this.router.navigate(['/client/' + this.id]);
    this.showBalanceUpdateInput = false;
  }

  onDeleteClick() {
    if (confirm('Are you sure you want to delete?')) {
      this.clientService.deleteClient(this.id);
      this.fms.show('Client deleted successfully!', {cssClass: 'alert-success', timeout: 4000});
      this.router.navigate(['/']);
    }
  }

}
