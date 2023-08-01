import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My First ng app';

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

  prettiFy = (_str: string) => {
    const arr = _str.split(' ');

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(' ');
    return str2;
  };
}
