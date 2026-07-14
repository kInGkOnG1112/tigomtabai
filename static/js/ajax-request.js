class AjaxRequest {

    async postRequest(requestURL, formData, submitBtn = null, redirectionURL = '', prompt = true){
        let oldBtnText = ''

        if (submitBtn) {
            oldBtnText = submitBtn.html()
            submitBtn.html('Submitting...').attr('disabled', true);
        }
        try {
            const response = await $.ajax({
                url: requestURL,
                data: formData,
                type: "POST",
                processData: false,
                contentType: false,
                dataType: "json"
            });

            if (prompt){
                await Swal.fire({
                    allowOutsideClick: false,
                    title: response.success ? 'Success!' : 'Error!',
                    text: response.message || (response.success ? 'Operation successful.' : 'An error occurred.'),
                    icon: response.success ? "success" : "error",
                });
            }

            if (response.success) {
                window.onbeforeunload = null;
                if (redirectionURL !== 'flag_redirection') {
                    window.location.href = response.url || redirectionURL;
                }
            }

            return response;

        } catch (error) {
            console.error("API Error:", error);

            await Swal.fire({
                title: 'Error!',
                text: 'Something went wrong with the server request.',
                icon: 'error'
            });

            throw error;

        } finally {
            if (submitBtn) {
                submitBtn.html(oldBtnText).prop('disabled', false);
            }
        }
    }

    subpageRequest(requestURL, formData, divComponent, timer=1000){
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
