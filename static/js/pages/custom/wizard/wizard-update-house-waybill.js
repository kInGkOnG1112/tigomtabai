"use strict";
function checkSHIField() {
	var shi_data_type = $('#shi_data_type')
  	var elem = $(".shi-field");
  	var count = elem.filter(function() {
    	return !$(this).val();
  	}).length;
  	if (count !== elem.length) {
    	elem.removeClass('is-invalid')
		elem.next().next().remove()
  	}
  	if(shi_data_type.val() === 'without_attachment'){
  		return true;
	}
  	return count !== elem.length;
}
function recheckedToDigits(n) {
	if (n){
		n = n.toString().replace(',', '')
		n = parseFloat(n)
		return n.toString()
	}
	return '0'
}
// Class definition
var KTWizard4 = function () {
	// Base elements
	var _wizardEl;
	var _formEl;
	var _wizard;
	var _validations = [];
	var _cheque_validations = [];

	// Private functions
	var initWizard = function () {
		// Initialize form wizard
		_wizard = new KTWizard(_wizardEl, {
			startStep: 1, // initial active step number
			clickableSteps: true  // allow step clicking
		});
		// Validation before going to next page
		_wizard.on('beforeNext', function (wizard) {
			// Don't go to the next step yet
			_wizard.stop();
			let payment = $('#payment').val()
			let cash_slip = $('#cash_deposit_slip').val()
			let check_slip = $('#check_deposit_slip').val()
			let signature = $('#signature_image_validation').val()
			let delivery_supp = $('#delivery_supp').val()

			var validator = _validations[wizard.getStep() - 1];

			if ($('#collection_type').val() === 'with_collection' && wizard.getStep() === 1){
				checkSHIField()
				var invalid = $(".is-invalid");
				console.log(payment)
				if (payment === 'cheque'){
					if (check_slip){
						let index =  !checkSHIField()? 6 : 7
						invalid.next().next().remove()
						validator = _validations[index];
					}else{
						let index =  !checkSHIField()? 4 : 5
						invalid.next().next().remove()
						validator = _validations[index];
					}
				}else if (payment === 'cash') {
					if (cash_slip){
						let index =  !checkSHIField()? 8 : 9
						invalid.next().next().remove()
						validator = _validations[index];
					}else{
						let index =  !checkSHIField()? 2 : 3
						invalid.next().next().remove()
						validator = _validations[index];
					}
				}else if (payment === 'cash_and_cheque') {
					let index = 0
					if (cash_slip && check_slip){
						index =  !checkSHIField()? 13 : 14
						invalid.next().next().remove()
						validator = _validations[index];
					}else{
						index =  !checkSHIField()? 11 : 12
						invalid.next().next().remove()
						validator = _validations[index];
					}
				}
			}else if($('#collection_type').val() === 'without_collection' && wizard.getStep() === 1){
				let index =  !checkSHIField()? 0 : 10
				validator = _validations[index];
			}
			if (wizard.getStep() === 2){
				let index = delivery_supp && $('.proof_field_name_1').length >= 1? 10 : 1
				validator = _validations[index];
			}
			// Validate form
			validator.validate().then(function (status) {
				let text = ''
				if (status === 'Valid') {
					_wizard.goNext();
					KTUtil.scrollTop();
					$('.fv-plugins-message-container').remove();
				}else{
					if ($('#collection_type').val() === 'with_collection' && !checkSHIField()){
						text = "Please input at least 1 SHI data."
					}else if(status === 'Invalid'){
						text = "Cant proceed! Please fill up all the required fields."
					}else {
						text = "Sorry, looks like there are some errors detected, please try again."
					}

					Swal.fire({
						text: text,
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Ok, got it!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-light"
						}
					}).then(function () {
						KTUtil.scrollTop();
					});
				}
			});
		});

		// Change event
		_wizard.on('change', function (wizard) {
			KTUtil.scrollTop();
		});
	}

	var initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		// Step 1
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					/*proof_field_name: {
						validators: {
							notEmpty: {
								message: 'Attached field name is required'
							}
						}
					},
					proof_file: {
						validators: {
							notEmpty: {
								message: 'Attached file is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 2
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*cash_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Deposit slip is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 3
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*cash_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Deposit slip is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 4
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*check_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Check deposit slip is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 5
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*check_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Check deposit slip is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 6
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 7
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 8
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 9
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
		// Step 10
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 11
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					shi5_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*cash_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Deposit slip is required'
							}
						}
					},*/
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*check_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Check deposit slip is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 12
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*cash_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Deposit slip is required'
							}
						}
					},*/
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					/*check_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Check deposit slip is required'
							}
						}
					},*/
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 13
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					si_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					pr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					dr_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					or_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					shi5_fields_: {
						validators: {
							notEmpty: {
								message: 'At least input 1 SHI data.'
							}
						}
					},
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 12
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					cash_bank_account_number: {
						validators: {
							notEmpty: {
								message: 'Account number is required'
							}
						}
					},
					cash_bank_account_name: {
						validators: {
							notEmpty: {
								message: 'Account name required'
							}
						}
					},
					cash_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank name is required'
							}
						}
					},
					cash_reference_number: {
						validators: {
							notEmpty: {
								message: 'Reference number is required'
							}
						}
					},
					cash_deposit_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					cash_deposit_time: {
						validators: {
							notEmpty: {
								message: 'Deposit time is required'
							}
						}
					},
					cash_amount_deposited: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
					check_bank_name: {
						validators: {
							notEmpty: {
								message: 'Bank is required'
							}
						}
					},
					check_payee: {
						validators: {
							notEmpty: {
								message: 'Payee is required'
							}
						}
					},
					check_issuer: {
						validators: {
							notEmpty: {
								message: 'Issuer is required'
							}
						}
					},
					check_number: {
						validators: {
							notEmpty: {
								message: 'Check number is required'
							}
						}
					},
					check_date: {
						validators: {
							notEmpty: {
								message: 'Date is required'
							}
						}
					},
					check_amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
	}

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('kt_wizard_v4');
			_formEl = KTUtil.getById('kt_form');

			initWizard();
			initValidation();
		}
	};
}();

jQuery(document).ready(function () {
	KTWizard4.init();
});
