class AjaxRequest {

    postRequest(
        requestURL,
        formData,
        submitBtn,
        redirectionURL,
    ){
        let oldBtnText = ''
        if (submitBtn) {
            oldBtnText = submitBtn.html()
            submitBtn.html('Submitting...').attr('disabled', true);
        }
        return $.Deferred((defer) => {
            $.ajax({
                url: requestURL,
                data: formData,
                type: "POST",
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response.error)
                    Swal.fire({ allowOutsideClick: false,
                        title: response.success ? 'Success!' : 'Error!',
                        text: response.message,
                        icon: response.success ? "success":"error",
                        type: response.success ? "success":"error",
                    }).then(() => {
                        if (response.success) {
                            window.onbeforeunload = null;
                            if (redirectionURL !== 'flag_redirection'){
                                location.href = response.url ? response.url : redirectionURL
                            }
                        }
                    });
                    if (submitBtn) {submitBtn.html(oldBtnText).attr('disabled', false);}
                    // Resolve the promise with the response
                    defer.resolve(response);
                }
            });
        }).promise(); // Convert to a promise to enable chaining
    }

    subpageRequest(
        requestURL,
        formData,
        divComponent,
        timer=1000
    ){
        const divLoader = `
            <div class="col-lg-12 pl0">
                <div class="d-flex justify-content-center align-items-center p100">
                    <div class="spinner spinner-primary spinner-lg mr-15"></div>
                    <label>Loading</label>
                </div>
            </div>
        `
        divComponent.html(divLoader)
        setTimeout(function () {
            $.ajax({
                url: requestURL,
                data: formData,
                type: 'GET',
                dataType: 'text',
                success: function(response){
                    if(response){
                        divComponent.html(response)
                    }
                }
            })
        }, timer)
    }
}
