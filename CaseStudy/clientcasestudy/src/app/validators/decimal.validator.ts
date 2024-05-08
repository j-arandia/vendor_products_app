import { AbstractControl } from '@angular/forms';
export function ValidateDecimal(
  control: AbstractControl
): { invalidDecimal: boolean } | null {
  const DECIMAL_REGEXP = /^-?\d*[.,]?\d{0,2}$/;
  return !DECIMAL_REGEXP.test(control.value) ? { invalidDecimal: true } : null;
} // ValidateDecimal
