"use strict";
let reference = true
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
			// var validator = _validations[wizard.getStep() - 1]; // get validator for current step
			var validator = _validations[wizard.getStep() - 1];

			if (wizard.getStep() === 2){
				let list_value = 0
				$(".proof_field_name").each(function(index, element, set) {
					if ($(element).val() !== '' && $('.proof_file').eq(index).val() !== ''){
						list_value += 1
					}
				});
				if (list_value >= 1){
					validator = _validations[3];
				}

			}
			// Validate form
			validator.validate().then(function (status) {
				console.log(reference)
				if (status == 'Valid') {
					if (wizard.getStep() === 1 && !reference){
						Swal.fire({
							text: "Reference number already exist! Please input new unique reference number.",
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-light"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}else{
						_wizard.goNext();
						KTUtil.scrollTop();
					}
				} else {
					if (wizard.getStep() === 2){
						let list_value = 0
						$(".proof_field_name").each(function(index, element, set) {
							if ($(element).val() !== '' && $('.proof_file').eq(index).val() !== ''){
								list_value += 1
							}
						});
						if (list_value === 0){
							Swal.fire({
								text: "Attach supporting file is required! Please attach at least 1 file with its field name.",
								icon: "error",
								buttonsStyling: false,
								confirmButtonText: "Ok, got it!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-light"
								}
							}).then(function () {
								KTUtil.scrollTop();
							});
						}else{
							Swal.fire({
								text: "Sorry, looks like there are some errors detected, please try again.",
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

					}else{
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
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
					actual_amount_collected: {
						validators: {
							notEmpty: {
								message: 'Actual amount collected is required'
							}
						}
					},
					collection_type: {
						validators: {
							notEmpty: {
								message: 'Collection type is required'
							}
						}
					},
					ibs_account_number: {
						validators: {
							notEmpty: {
								message: 'IBS/Account number type is required'
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

		// Step 2
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					current_shipment_status: {
						validators: {
							notEmpty: {
								message: 'Current Shipment status is required'
							}
						}
					},
					current_date: {
						validators: {
							notEmpty: {
								message: 'Current date is required'
							}
						}
					},
					proof_field_name: {
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
					},
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
					check_deposit_slip: {
						validators: {
							notEmpty: {
								message: 'Check deposit slip is required'
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
		// Step 4
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					current_shipment_status: {
						validators: {
							notEmpty: {
								message: 'Current Shipment status is required'
							}
						}
					},
					current_date: {
						validators: {
							notEmpty: {
								message: 'Current date is required'
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
