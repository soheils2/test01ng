import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
})
export class PasswordChangeComponent implements OnInit {
  currentId: string;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => (this.currentId = params.get('id'))
    );
  }
}
