"use strict";
let recheck_reference = true;
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
			let delivery_supp = $('#delivery_supp').val()
			// var validator = _validations[wizard.getStep() - 1]; // get validator for current step
			var validator = _validations[wizard.getStep() - 1];

			if (wizard.getStep() === 2){
				let index = delivery_supp && $('.proof_field_name_1').length > 0? 1 : 2
				console.log(index, $('.proof_field_name_1').length);
				validator = _validations[index];
			}
			// Validate form
			validator.validate().then(function (status) {
				if (status == 'Valid') {
					if (wizard.getStep() === 1 && !recheck_reference){
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
