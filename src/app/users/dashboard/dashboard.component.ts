import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AccountService } from 'src/app/core/account.service';
import { Dash } from 'src/app/shared/dash-response.model';
import { NotifyService } from 'src/app/shared/notify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboard$: Observable<Dash>;

  dashboard: Dash;
  dashForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('')]],
  });

  // firstName: String;
  // lastName: String;
  // email: String;
  // phone: String;
  // isEmailActive: boolean;
  // isPhoneActive: boolean;

  submitAttempted = false;
  errors: string[] = [];
  originalDash: Dash;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private dialogService: NotifyService
  ) {}

  // Use it for automatic unsubscribing when destroying the component
  private onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    // Prefetch data
    this.route.data.subscribe((data: { resolvedValues: { dash: Dash } }) => {
      this.dashboard = data.resolvedValues.dash;
      // console.log('dash Updated:', data);
      this.dashForm.patchValue(this.dashboard);
    });

    // this.accountService.getDashboard();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
