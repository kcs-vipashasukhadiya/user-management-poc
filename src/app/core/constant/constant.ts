export class Label {
  static readonly EDIT_USER_TITLE = 'Edit User';
  static readonly ADD_USER_TITLE = 'Add User';
  static readonly FIRST_NAME = 'First Name';
  static readonly LAST_NAME = 'Last Name';
  static readonly GENDER = 'Gender';
  static readonly USER_NAME = 'User Name';
  static readonly PASSWORD = 'Password';
  static readonly CONFIRM_PASSWORD = 'Confirm Password';
  static readonly USER_NOTIFICATION_TYPE = 'User Notification Type';
  static readonly EMAIL_ID = 'Email Id';
  static readonly MOBILE_NO = 'Mobile No.';
  static readonly ADDRESS_LINE1 = 'Address Line 1';
  static readonly ADDRESS_LINE2 = 'Address Line 2';
  static readonly COUNTRY = 'Country';
  static readonly STATE = 'State';
  static readonly CITY = 'City';
  static readonly ZIP_CODE = 'Zip Code';
  static readonly USER_STATUS = 'User Status';
  static readonly CAPTCHA = 'Captcha';
}

export class Message {
  static readonly ONLY_ADMIN_CAN_LOGIN = 'Only Admin can login';
  static readonly INVALID_CREDENTIALS = 'Invalid Credentials';
  static readonly SUBMIT_MSG: string = 'User submitted successfully';
  static readonly SUBMIT_ERROR_MSG: string = 'User submission failed';
  static readonly STATUS_CHANGED_MSG: string = 'User status changed successfully';
  static readonly STATUS_CHANGED_ERROR_MSG: string = 'Failed to change user status';
}

export class Validation{
  static readonly REQUIRED: string = 'required';
  static readonly MIN_LENGTH_2: string = 'must be at least 2 characters';
  static readonly MIN_LENGTH_6: string = 'must be at least 6 characters';
  static readonly MIN_LENGTH_8: string = 'must be at least 8 characters';
  static readonly MAX_LENGTH_20: string = 'must not exceed 20 characters';
  static readonly FIX_LENGTH_6: string = 'should have 6 digits only';
  static readonly FIX_LENGTH_10: string = 'should have 10 digits only';
  static readonly ALLOWED_ONLY_NUMBERS: string = 'allowed only numbers';
  static readonly NOT_ALLOWED_NUMBERS: string = 'should not allowed numbers';
  static readonly NOT_ALLOWED_SPACE: string = 'should not allowed space';
  static readonly ALREADY_EXISTS: string = 'already exists';
  static readonly VALID_PASSWORD: string = 'must have at least one number, one lowercase, one uppercase and one special character';
  static readonly PASSWORD_MISMATCH: string = 'did not match with password';
  static readonly INVALID: string = 'not valid';
}
