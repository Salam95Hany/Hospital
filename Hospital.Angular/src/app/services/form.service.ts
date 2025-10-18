import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  buildFormData(formData, data, parentKey = null, key = null) {
    if (data instanceof File)
      formData.append('Files', data);
    else if (data && typeof data === 'object' && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key, key);
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
  }

  NumbersOnly(key: any): boolean {
    let patt = /^([0-9\+.])$/;
    let result = patt.test(key);
    return result;
  }

  TrimFormInputValue(ItemForm: FormGroup) {
    Object.keys(ItemForm.value).forEach(key => {
      if (typeof (ItemForm.value[key]) == 'string') {
        ItemForm.get(key).setValue(ItemForm.value[key]?.trim())
        ItemForm.get(key).setValue(ItemForm.value[key].replace(/\s+/g, ' '))
      }
    });

    return ItemForm;
  }


  public markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  public validationMessages() {
    const messages = {
      required: 'This field is required',
      email: 'Invalid email address',
      pattern: 'Invalid input pattern',
      min: 'The entered value is less than the minimum allowed',
      max: 'The entered value is greater than the maximum allowed',
      invalid_URL: 'Invalid URL',
      endDateLessThanStartDate: (error: string) => error || 'The end date must be greater than the start date',
      regexPattern: (error: string) => error || 'Invalid input pattern',
      arrayLength: (error: string) => error || 'Invalid number of items',
      invalidExtension: (matches: any[]) => {
        let matchedCharacters = matches;
        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `File extension not allowed. Allowed extensions are: ${matchedCharacters}`;
      },
      invalid_characters: (matches: any[]) => {

        let matchedCharacters = matches;

        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `Invalid characters: ${matchedCharacters}`;
      },
    };

    return messages;
  }

  public validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
    const form = formToValidate;

    for (const field in formErrors) {
      if (field) {
        formErrors[field] = '';
        const control = form.get(field);

        const messages = this.validationMessages();
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {

              if (key && !['invalid_characters', 'invalidExtension', 'endDateLessThanStartDate', 'regexPattern', 'dateGreaterThan', 'dateLessThan', 'arrayLength'].includes(key)) {
                formErrors[field] = formErrors[field] || messages[key];
              }
              else {
                formErrors[field] = formErrors[field] || messages[key](control.errors[key]);
              }
            }
          }
        }
      }
    }

    return formErrors;
  }

  public updateFieldsRequiredValidation(formGroup: FormGroup, field: string, isRequired: boolean) {
    const control: AbstractControl | null = formGroup.get(field);
    if (!control) return;

    if (isRequired) {
      control.addValidators(Validators.required);
    } else {
      control.removeValidators(Validators.required);
    }

    control.updateValueAndValidity();
  }
}
