import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

const validCharacters = /[^\s\w,.:&\/()+%'`@-]/;
const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

export class CustomValidators extends Validators {

    static regexPattern(type: RegexType, message: string = null): ValidatorFn {
        const regex = regexList.find(x => x.type === type);
        if (!regex) {
            return (control: AbstractControl) => null;
        }

        return (control: AbstractControl) => {
            if (control.value && !regex.pattern.test(control.value)) {
                return { regexPattern: message ? message : regex.message };
            }
            return null;
        };
    }

    static endDateGreaterThanStartDate(startDateCName: string, endDateCName: string, message = null): ValidatorFn {
        return (formGroup: AbstractControl) => {
            const startDate_C = formGroup.get(startDateCName);
            const endDate_C = formGroup.get(endDateCName);

            if (startDate_C?.value && endDate_C?.value) {
                const startDate = new Date(startDate_C?.value);
                const endDate = new Date(endDate_C?.value);

                if (startDate >= endDate) {
                    endDate_C.setErrors({ endDateLessThanStartDate: message });
                } else {
                    endDate_C.setErrors(null);
                    return null;
                }
            }

            return null;
        };
    }

    static dateGreaterThanToday(specificDate: Date, message: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        const inputDate = new Date(control.value);
        specificDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        if (inputDate >= specificDate) {
          return { dateGreaterThan: message };
        }
      }
      return null;
    };
  }

  static dateLessThanToday(specificDate: Date, message: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        const inputDate = new Date(control.value);
        specificDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        if (inputDate < specificDate) {
          return { dateLessThan: message };
        }
      }
      return null;
    };
  }

}

export interface RegexModel {
    pattern: RegExp;
    message: string;
    type: RegexType;
}

export enum RegexType {
    text = 1,
    email,
    url,
    number,
    date,
    alpha,
    alphaAllowSpaces,
    alphaAllowSpacesAndSplash,
    alphaNumeric,
    alphaNumericAllowSpaces,
    alphaNumericAllowDash,
    numericAllowDash,
    numeric,
    currency,
    addressLine,
    noSpace,
    phoneNumber,
    englishLettersOnly,
    FourMinLength,
    password

}
export const regexList: RegexModel[] = [
    {
        pattern: /^[0-9]+(\.[0-9]+)?$/,
        message: "Only numbers are allowed (with an optional decimal point).",
        type: RegexType.number
    },
    {
        pattern: /^[a-zA-Z]+$/,
        message: "Only letters are allowed.",
        type: RegexType.alpha
    },
    {
        pattern: /^[a-zA-Z\s]+$/,
        message: "Only letters and spaces are allowed.",
        type: RegexType.alphaAllowSpaces
    },
    {
        pattern: /^[a-zA-Z\s/]+$/,
        message: "Only letters, spaces, and slashes (/) are allowed.",
        type: RegexType.alphaAllowSpacesAndSplash
    },
    {
        pattern: /^[a-zA-Z0-9]+$/,
        message: "Only letters and numbers are allowed.",
        type: RegexType.alphaNumeric
    },
    {
        pattern: /^[a-zA-Z0-9\s]+$/,
        message: "Only letters, numbers, and spaces are allowed.",
        type: RegexType.alphaNumericAllowSpaces
    },
    {
        pattern: /^[a-zA-Z0-9-]+$/,
        message: "Only letters, numbers, and hyphens (-) are allowed.",
        type: RegexType.alphaNumericAllowDash
    },
    {
        pattern: /^\d+$/,
        message: "Only numbers are allowed.",
        type: RegexType.numeric
    },
    {
        pattern: /^[0-9-]+$/,
        message: "Only numbers and hyphens (-) are allowed.",
        type: RegexType.numericAllowDash
    },
    {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: "Valid currency format (up to two decimal places).",
        type: RegexType.currency
    },
    {
        pattern: /^[\w\s,-]+$/,
        message: "Only letters, numbers, spaces, commas, and hyphens are allowed.",
        type: RegexType.addressLine
    },
    {
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        message: "Date format must be YYYY-MM-DD.",
        type: RegexType.date
    },
    {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address.",
        type: RegexType.email
    },
    {
        pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
        message: "Invalid URL.",
        type: RegexType.url
    },
    {
        pattern: /^[a-zA-Z\s]+$/,
        message: "Only text (letters and spaces) is allowed.",
        type: RegexType.text
    },
    {
        pattern: /^(?!\s*$).+/,
        message: "The field cannot contain only spaces.",
        type: RegexType.noSpace
    },
    {
        pattern: /^(?:01[0125]\d{8}|00[1-9]\d{5,13})$/,
        message: "Invalid phone number.",
        type: RegexType.phoneNumber
    },
    {
        pattern: /^[a-zA-Z \-\']+/,
        message: "Only English letters are allowed.",
        type: RegexType.englishLettersOnly
    },
    {
        pattern: /^.{4,}$/,
        message: "Password must be at least 4 characters long.",
        type: RegexType.FourMinLength
    },
    {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/,
        message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character (@, #, $, %, etc.).",
        type: RegexType.password
    }

];