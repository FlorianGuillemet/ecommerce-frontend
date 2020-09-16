import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CustomValidator } from 'src/app/validators/custom-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // declare our form group
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  shippingAddressFormGroupName: string = 'shippingAddress';


  // inject form Builder
  constructor(private formBuilder: FormBuilder,
              private checkoutFormService: CheckoutFormService) { }

  ngOnInit(): void {

    // build the form
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                  [Validators.required,
                                   Validators.minLength(2),
                                   CustomValidator.notOnlyWhitespace]),
        lastName: new FormControl('',
                                  [Validators.required,
                                   Validators.minLength(2),
                                   CustomValidator.notOnlyWhitespace]),
        email: new FormControl('',
                              [Validators.required,
                               Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{5,6}')])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{5,6}')])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    // populate credit card years

    this.checkoutFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    // populate countries

    this.checkoutFormService.getCountries().subscribe(
      data => this.countries = data
    );

  }

  // define Getter methods to access form controls from the Html
  get firstName(): AbstractControl { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(): AbstractControl { return this.checkoutFormGroup.get('customer.lastName'); }
  get email(): AbstractControl { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(): AbstractControl { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(): AbstractControl { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(): AbstractControl { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry(): AbstractControl { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode(): AbstractControl { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet(): AbstractControl { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(): AbstractControl { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(): AbstractControl { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry(): AbstractControl { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode(): AbstractControl { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType(): AbstractControl { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(): AbstractControl { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(): AbstractControl { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(): AbstractControl { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit(): void {
    console.log('handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);

    console.log('The shippingAddress country is : ' + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log('The shippingAddress state is : ' + this.checkoutFormGroup.get('shippingAddress').value.state.name);

  }

  copyShippingAddressToBillingAddress(event): void {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix: the shipping address states won't copy on billng address states
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      this.checkoutFormGroup.controls.billingAddress
      .reset();

      // bug fix: the shipping address states won't copy on billng address states
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(): void{

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();

    // to get the form value
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month.

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }


  /*
  // another way to make two fields dependent:
  // pass as a parameter of the method the value of the field that has changed
  // in html: use $event.target.value to pass the parameter value.
  // <select formControlName="expirationYear" type="text" (change)="handleMonthsAndYears($event.target.value)"

  handleMonthsAndYears(selectedYear: number): void{

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();

    // if the current year equals the selected year, then start with the current month.

    let startMonth: number;

    if (currentYear === Number(selectedYear)) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }
  */

  getStates(formGroupName: string): void {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCodeSelected = formGroup.value.country.code;

    console.log('formGroup : ' + JSON.stringify(formGroup.value));
    console.log('countryCode : ' + JSON.stringify(countryCodeSelected));

    this.checkoutFormService.getStates(countryCodeSelected).subscribe(
      data => {

        if (formGroupName === this.shippingAddressFormGroupName) {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        console.log('states : ' + JSON.stringify(this.shippingAddressStates));
        this.shippingAddressStates.forEach(eachState => console.log(eachState.name));

        // select the firts item by default
        formGroup.get('state').setValue(data[0]);
      }
    );


  }

}
