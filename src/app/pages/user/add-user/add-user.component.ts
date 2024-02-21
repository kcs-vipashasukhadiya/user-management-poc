import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { USER_GENDER, USER_NOTIFICATION, USER_STATUS, USER_TYPE } from '../../../core/constant/enum';
import { PasswordMatchService } from '../../../core/validators/password-match.service';
import { CustomValidator } from '../../../core/validators/custom-validator.service';
import { TitleCaseDirective } from '../../../core/directive/titlecase.directive';
import { AsyncValidatorService } from '../../../core/validators/async-validator.service';
import { UserService } from '../../../core/service/user.service';
import { User } from '../../../core/data/user';
import { onDestroy } from '../../../core/service/on-destroy.service';
import { takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { City, Country, ICity, ICountry, IState, State } from 'country-state-city';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCaseDirective, MaterialModule],
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  userService: UserService = inject(UserService);
  passwordMatchService: PasswordMatchService = inject(PasswordMatchService);
  asyncValidator: AsyncValidatorService = inject(AsyncValidatorService);
  toastr: ToastrService = inject(ToastrService);
  dialogRef: MatDialogRef<AddUserComponent> = inject(MatDialogRef<AddUserComponent>);
  destroy$ = onDestroy();
  userForm: FormGroup;
  isSubmitted: boolean = false;
  gender: Array<string> = [];
  notificationType: Array<string> = [];
  userStatusArr: Array<string> = [];
  countries: ICountry[] = Country.getAllCountries();
  states: IState[] = null;
  cities: ICity[] = null;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  user: User = null;
  inputData: any;
  isDisabled: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.gender = Object.keys(USER_GENDER).filter((f) => isNaN(Number(f)));
    this.notificationType = Object.keys(USER_NOTIFICATION).filter((f) => isNaN(Number(f)));
    this.userStatusArr = Object.keys(USER_STATUS).filter((f) => isNaN(Number(f)));
  }

  ngOnInit() {
    if (this.userService.selectedUserId) {
      this.userService.getUserById(this.userService.selectedUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.user = res;
            this.isDisabled = true;
            const countryCode = Country.getAllCountries()?.find(a => a.name === this.user.country)?.isoCode;
            this.states = State.getStatesOfCountry(countryCode);
            const stateCode = this.states?.find(a => a.name === this.user.state)?.isoCode;
            this.cities = City.getCitiesOfState(countryCode, stateCode);

            this.userForm.patchValue({
              firstName: this.user?.firstName,
              lastName: this.user?.lastName,
              gender: this.user?.gender,
              userName: this.user.userName,
              password: this.user.password,
              confirmPassword: this.user.password,
              userNotificationType: this.user.userNotificationType,
              emailId: this.user.emailId,
              mobileNo: this.user.mobileNo,
              address1: this.user.addressLine1,
              address2: this.user.addressLine2,
              country: countryCode,
              state: stateCode,
              city: this.user.city,
              zipcode: this.user.zipCode,
              userStatus: this.user.userStatus
            })
          }
      })
    }

    this.inputData = this.data;
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      gender: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), CustomValidator.cannotContainSpace], this.asyncValidator.userNameExists()],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), CustomValidator.weekPassword]],
      confirmPassword: ['', [Validators.required]],
      userNotificationType: ['', [Validators.required]],
      emailId: ['', [], this.asyncValidator.emailIdExists()],
      mobileNo: ['', []],
      address1: ['', []],
      address2: ['', []],
      country: ['', []],
      state: ['', []],
      city: ['', []],
      zipcode: ['', [Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      userStatus: ['Active', []]
    },
      {
        validators: this.passwordMatchService.matchPassword,
      } as any
    );

    this.f['userNotificationType'].valueChanges.subscribe(
      (val) => {
        if (val === USER_NOTIFICATION.Mobile) {
          this.f['mobileNo'].setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]);
          this.f['emailId'].removeValidators(Validators.required);
        }
        else {
          this.f['emailId'].setValidators([Validators.required, Validators.email]);
          this.f['mobileNo'].removeValidators(Validators.required);
        }
        this.f['emailId'].updateValueAndValidity();
        this.f['mobileNo'].updateValueAndValidity();
      }
    )
  }

  get f() {
    return this.userForm.controls;
  }

  onCountryChanged(event: any) {
    this.selectedCountry = event.value;
    this.states = State.getStatesOfCountry(this.selectedCountry);
    this.cities = null;
    this.selectedCity = '';
    this.selectedState = '';
  }

  onStateChanged(event: any) {
    this.selectedState = event.value;
    this.cities = City.getCitiesOfState(this.selectedCountry, this.selectedState);
    this.selectedCity = '';
  }

  onCityChanged(event: any) {
    this.selectedCity = event.value;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    this.userService.getMaxUserId().then((id: number) => {
      let user: User = {
        id: this.user ? this.user.id : String(id),
        firstName: this.f['firstName'].value,
        lastName: this.f['lastName'].value,
        gender: this.f['gender'].value,
        userName: this.f['userName'].value,
        password: this.f['password'].value,
        confirmPassword: this.f['confirmPassword'].value,
        userNotificationType: this.f['userNotificationType'].value,
        emailId: this.f['emailId'].value,
        mobileNo: this.f['mobileNo'].value,
        addressLine1: this.f['address1'].value,
        addressLine2: this.f['address2'].value,
        country: Country.getCountryByCode(this.f['country'].value).name,
        state: State.getStateByCodeAndCountry(this.f['state'].value, this.f['country'].value).name,
        city: this.f['city'].value,
        zipCode: this.f['zipcode'].value,
        userType: USER_TYPE.EndUser,
        userStatus: this.f['userStatus'].value
      };

      this.userService.postUser(user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => { this.toastr.success(data.userName + ' User submitted successfully!'); },
          error: (err) => { this.toastr.error('User submission failed! Error: ' + err); },
          complete: () => {
            this.closePopup();
          }
        })
    });
  }

  closePopup() {
    this.dialogRef.close();
  }
}
