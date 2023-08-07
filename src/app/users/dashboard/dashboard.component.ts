import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
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
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/09(0|1|2|3|9)-?[0-9]{4}-?[0-9]{4}/),
      ],
    ],
    isEmailActive: [],
    isPhoneActive: [],
  });

  get firstName() {
    return this.dashForm.get('firstName');
  }
  get lastName() {
    return this.dashForm.get('lastName');
  }
  get email() {
    return this.dashForm.get('email');
  }
  get phone() {
    return this.dashForm.get('phone');
  }

  submitAttempted = false;
  errors: string[] = [];
  originalDash: Dash;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private notify: NotifyService
  ) {}

  // Use it for automatic unsubscribing when destroying the component
  private onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    // Prefetch data
    this.route.data.subscribe((data: { resolvedValues: { dash: Dash } }) => {
      this.dashboard = data.resolvedValues.dash;
      // console.log('dash Updated:', data);
      this.dashForm.patchValue(this.dashboard);
      let _dd = new Dash();
      Object.assign(_dd, data.resolvedValues.dash);
      this.originalDash = _dd;
    });

    // this.accountService.getDashboard();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  shallowEqual(object1: object, object2: object) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }
  onSubmit() {
    this.submitAttempted = true;
    // console.log(this.dashForm.value);
    // console.log(this.originalDash);
    if (this.dashForm.valid) {
      let _dash = new Dash();
      Object.assign(_dash, this.dashForm.value);
      if (!this.shallowEqual(this.originalDash, this.dashForm.value)) {
        this.accountService
          .updateUser(_dash)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            (createdUser) => {
              this.notify.success('تغییرات موفق', 3000);
              this.dashForm.markAsPristine(); // So that navigating away is allowed by the guard after saving
              this.router.navigate(['/login']);
            },
            (error) => {
              // console.log('err hpnd:', error);

              if (error.hasOwnProperty('inUse')) {
                // integrate into angular's validation if we have field validation
                this.dashForm.controls['email'].setErrors({
                  inUse: true,
                });
                this.notify.err(
                  'آدرس ایمیل قبلا توسط فرد دیگری استفاده شده است.'
                );
              } else {
                // if we have cross field validation then show the validation error at the top of the screen
                this.errors.push(error['email']);
              }
            }
          );
      } else {
        this.notify.warn('بدون تغییر', 500);
      }
    } else {
      this.notify.err('لطفا مقادیر مورد نیاز را وارد نمایید');
    }
  }
}
