import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { PageUsers } from '../../shared/page-users.model';
import { map } from 'rxjs/operators';
import { Dash } from 'src/app/shared/dash-response.model';

@Component({
  selector: 'app-support',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class SupportComponent {
  userList: Dash[];

  totalUsers: number;
  page: number = 1;
  sortOrder: string = 'Fname';
  searchString: string = '';
  pageSize: number = 10;

  searchForm = this.fb.group({
    searchString: [''],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        map((params) => {
          this.page = +params.get('page') || 1;
          this.pageSize = +params.get('pageSize') || 10;
          this.sortOrder = params.get('sortOrder') || 'Fname';
          this.searchString = params.get('searchString') || '';
        })
      )
      .subscribe();
    // Prefetch data
    this.route.data.subscribe((data: { resolvedValues: PageUsers }) => {
      // console.log('users ready', data.resolvedValues);
      this.userList = data.resolvedValues.users;
      this.totalUsers = data.resolvedValues.totalUsers;
    });
  }

  onSearch() {
    let params: Params = {
      page: '1',
      searchString: this.searchForm.get('searchString').value,
    };

    // Update route with the page number and allow page bookmarking for user convenience
    this.router.navigate([], {
      // relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  onSearchReset() {
    this.searchForm.get('searchString').setValue('');

    let params: Params = {
      page: '1',
      searchString: '',
    };

    // Update route with the page number and allow page bookmarking for user convenience
    this.router.navigate([], {
      // relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  onHeaderClick(header: string) {
    let newSortOrder = this.sortOrder;

    switch (header) {
      case 'Fname': {
        newSortOrder = this.sortOrder == 'Fname' ? 'Fname_desc' : 'Email';
        break;
      }
      case 'Lname': {
        newSortOrder = this.sortOrder == 'Lname' ? 'Lname_desc' : 'Lname';
        break;
      }
      case 'Email': {
        newSortOrder = this.sortOrder == 'Email' ? 'Email_desc' : 'Email';
        break;
      }
      case 'Approved': {
        newSortOrder =
          this.sortOrder == 'Approved' ? 'Approved_desc' : 'Approved';
        break;
      }
    }

    let params: Params = {
      page: '1',
      sortOrder: newSortOrder,
    };

    // Update route with the page number and allow page bookmarking for user convenience
    this.router.navigate([], {
      // relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  onChangePage(page: number) {
    let params: Params = {
      page: page.toString(),
    };

    // Update route with the page number and allow page bookmarking for user convenience
    this.router.navigate([], {
      // relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
