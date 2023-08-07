import { Component } from '@angular/core';
import { AccountService } from './core/account.service';
import { Router } from '@angular/router';

import { NotifyService } from './shared/notify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'کاربر پلاس';
  constructor(
    private notify: NotifyService,
    private accountService: AccountService,
    public router: Router
  ) {}
  data = [
    {
      title: 'Fire',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',

      tasks: [
        'codew Swap',
        'Test,Compile',
        'Feature List',
        'Gas Test',
        'Examine Device Area',
      ],
    },
    {
      title: 'AVA',
      description:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',

      tasks: [
        'Ava V3.99 Git',
        'Ava V4 Box',
        'Ava Sell Opinion',
        'Ava Dyno Timer',
        'Remote Bug',
        'Shadow 🔊',
        'MenuBar not Working',
        "Same Time Dosn't accour Errs!",
      ],
    },
    {
      title: 'ELevator',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

      tasks: [
        'codew Swap',
        'Test,Compile',
        'Feature List',
        'Gas Test',
        'Examine Device Area',
      ],
    },
    {
      title: 'Scale Machine',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',

      tasks: [
        'codew Swap',
        'Test,Compile',
        'Feature List',
        'Gas Test',
        'Examine Device Area',
      ],
    },
    {
      title: 'Hyrocheck',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',

      tasks: [
        'codew Swap',
        'Test,Compile',
        'Feature List',
        'Gas Test',
        'Examine Device Area',
      ],
    },
  ];
  data2 = [
    {
      image: '',
      title: '',
      description: '',
    },
  ];

  get isAuthenticated(): boolean {
    return this.accountService.isAuthenticated;
  }

  prettiFy = (_str: string) => {
    const arr = _str.split(' ');

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(' ');
    return str2;
  };

  onSignOut() {
    if (this.accountService.isAuthenticated) {
      this.accountService.signOut();

      this.router.navigate(['/login']);
      this.notify.warn('با موفقیت خارج شدید به امید دیدار مجدد', 3000);
    }
  }
}
