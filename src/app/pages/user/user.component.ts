import { Component, Inject, ViewChild, inject } from '@angular/core';
import { UserService } from '../../core/service/user.service';
import { User } from '../../core/data/user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { onDestroy } from '../../core/service/on-destroy.service';
import { takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { MaterialModule } from '../../material.module';
import { ToastrService } from 'ngx-toastr';
import { USER_STATUS, USER_TYPE } from '../../core/constant/enum';
import { Label, Message } from '../../core/constant/constant';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './user.component.html',
})
export class UserComponent {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  dialog: MatDialog = inject(MatDialog);
  destroy$ = onDestroy();
  users: User[];
  userStatusArr: Array<string> = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly LABEL: typeof Label = Label;
  columns = [
    {
      columnDef: 'id',
      header: Label.ID,
      cell: (element: User) => `${element.id}`,
    },
    {
      columnDef: 'firstName',
      header: Label.NAME,
      cell: (element: User) => `${element.firstName} ${element.lastName}`,
    },
    {
      columnDef: 'userNotificationType',
      header: Label.USER_NOTIFICATION_TYPE,
      cell: (element: User) => `${element.userNotificationType}`,
    },
    {
      columnDef: 'addressLine1',
      header: Label.ADDRESS,
      cell: (element: User) => `${element.addressLine1}, ${element.addressLine2}`,
    },
    {
      columnDef: 'userStatus',
      header: Label.USER_STATUS,
      cell: (element: User) => `${element.userStatus}`,
    },
    {
      columnDef: Label.ACTION,
      header: Label.ACTION,
      cell: (element: User) => '',
    },
  ];
  dataSource: any;
  displayColumns: string[] = this.columns.map(c => c.columnDef);

  ngOnInit() {
    this.userStatusArr = Object.keys(USER_STATUS).filter((f) => isNaN(Number(f)));
    this.getAllUsers();
    this.userService.refreshRequired.subscribe(a => this.getAllUsers());
  }

  getAllUsers() {
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.users = data;
        this.dataSource = new MatTableDataSource<User>(this.users.filter(a => a.userType === USER_TYPE.EndUser));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  filterData(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onStatusChanged(event: any) {
    debugger;
    if (event.value) {
      this.dataSource = new MatTableDataSource<User>(this.users.filter(a => a.userType === USER_TYPE.EndUser && a.userStatus === event.value));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataSource = new MatTableDataSource<User>(this.users.filter(a => a.userType === USER_TYPE.EndUser));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
  }

  openPopup() {
    this.dialog.open(AddUserComponent, {
      width: '60%',
      height: '500px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: this.userService.selectedUserId ? Label.EDIT_USER_TITLE : Label.ADD_USER_TITLE,
      }
    });
  }

  onAddUser() {
    this.userService.selectedUserId = null;
    this.openPopup();
  }

  onEditUser(id: number) {
    this.userService.selectedUserId = id;
    this.openPopup();
  }

  openDialog(id: number) {
    this.userService.selectedUserId = id;
    this.dialog.open(ConfirmDialog, {
      width: '400px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
    });
  }
}


@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  standalone: true,
  imports: [MaterialModule],
})
export class ConfirmDialog {
  dialogRef: MatDialogRef<ConfirmDialog> = inject(MatDialogRef<ConfirmDialog>);
  userService: UserService = inject(UserService);
  destroy$ = onDestroy();
  toastr = Inject(ToastrService);

  onClick() {
    this.userService.getUserById(this.userService.selectedUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const userStatus = res.userStatus === USER_STATUS.Active ? USER_STATUS.Inactive : USER_STATUS.Active;
          this.userService.patchUser({ userStatus: userStatus })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data) => { this.toastr.success(Message.STATUS_CHANGED_MSG); },
              error: (err) => { this.toastr.error(Message.STATUS_CHANGED_ERROR_MSG + ' Error: ' + err); },
              complete: () => {
                this.dialogRef.close();
              }
            })
        }
      })
  }
}
