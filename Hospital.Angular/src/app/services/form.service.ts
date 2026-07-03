import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  buildFormData(formData: FormData, data: any, parentKey: string | null = null) {
  if (data === null || data === undefined) return;

  if (data instanceof File) {
    formData.append(parentKey!, data);
  }
  else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
      this.buildFormData(formData, item, key);
    });
  }
  else if (typeof data === 'object' && !(data instanceof Date)) {
    Object.keys(data).forEach(key => {
      const value = data[key];

      if (value === null || value === undefined) return;

      if (key.toLowerCase() === 'file' && value instanceof File) {
        formData.append(`${parentKey}.${key}`, value);
      } else {
        this.buildFormData(formData, value, parentKey ? `${parentKey}.${key}` : key);
      }
    });
  }
  else {
    if (data !== '')
      formData.set(parentKey!, data);
  }
}

  NumbersOnly(key: any): boolean {
    let patt = /^([0-9\+.])$/;
    let result = patt.test(key);
    return result;
  }

  TrimFormInputValue(ItemForm: FormGroup) {
    Object.keys(ItemForm.value).forEach(key => {
    if (typeof ItemForm.value[key] === 'string') {
      ItemForm.get(key)?.setValue(ItemForm.value[key].trim());
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
      dateLessThan: (error: string) => error || 'The end date must be greater than the start date',
      dateGreaterThanToday: (error: string) => error || 'The end date must be greater than the start date',
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

              if (key && !['invalid_characters', 'invalidExtension', 'endDateLessThanStartDate', 'regexPattern', 'dateGreaterThanToday', 'dateLessThan', 'arrayLength'].includes(key)) {
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

  /**
   * Build FormData from a flat object.
   * - Appends primitive values as key => string(value)
   * - Appends File instances under their key
   * - Stringifies arrays and nested objects so server can parse them from a single field
   * - If parentKey is provided keys will be prefixed with `${parentKey}.` (optional)
   */
 buildFormDataFlat(formData: FormData, data: any, parentKey: string | null = null): void {
  if (data === null || data === undefined) return;

  // Handle File or Blob directly
  if (data instanceof File || data instanceof Blob) {
    formData.append(parentKey ?? 'file', data);
    return;
  }

  // Handle primitive types
  if (typeof data !== 'object' || data instanceof Date) {
    formData.append(parentKey ?? 'value', String(data));
    return;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
      this.buildFormDataFlat(formData, item, key);
    });
    return;
  }

  // Handle objects
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Construct new key
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    // Recurse deeper
    if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob) && !(value instanceof Date)) {
      this.buildFormDataFlat(formData, value, newKey);
    } else {
      formData.append(newKey, value instanceof Date ? value.toISOString() : String(value));
    }
  });
}
buildFormDataData(formData, data, parentKey = null, key = null) {
  if (data instanceof File)
    formData.append(key, data);
  else if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      this.buildFormDataData(formData, data[key], parentKey ? parentKey + '[' + key + ']' : key, key);
    });
  } else {
    const value = data == null ? '' : data;
    formData.append(parentKey, value);
  }
}
}
