import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Settings} from '../../services/Settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings;

  constructor(public settingsService: SettingsService,
              public fms: FlashMessagesService,
              public router: Router) {
  }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
  }

  onSubmit() {
    this.settingsService.changeSettings(this.settings);
    this.fms.show('Settings saved!', {cssClass: 'alert-success', timeout: 4000});
    this.router.navigate(['/settings']);
  }

}
