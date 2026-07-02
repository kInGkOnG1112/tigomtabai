//****************** Script for Address selection ******************//
$(document).ready(function (){
    // List variables for region, provinces, city and barangay
    let region = []
    let province = []
    let city = []
    let barangay = []

    // Elements variables
    let select_region = $('.kt_select2_region')
    let select_province = $('.kt_select2_province')
    let select_city = $('.kt_select2_city')
    let select_barangay = $('.kt_select2_barangay')

    // Variables for existing address
    let existing_province = $('#province_description').val()
    let existing_city = $('#city_description').val()

    // Load JSON file of address and add data to list variables
    // Add items for region select for initializing data in selection
    $.getJSON('/static/json_files/philippines_addresses/region.json', function (data) {
        let items = ''
        $.each( data, function( key, val ) {
            region.push({
                region_id:val.regCode,
                code:val.psgcCode,
                description:val.regDesc
            })
        });
         $.each( region, function( key, val ) {
            items += '<option value="' + val.description + '" >' + val.description + '</option>'
        });
        $('.kt_select2_region').append(items);
    })
    $.getJSON('/static/json_files/philippines_addresses/province.json', function (data) {
        $.each( data, function( key, val ) {
            province.push({
                province_id:val.provCode,
                region_id:val.regCode,
                code:val.psgcCode,
                description:val.provDesc
            })
        });
    })
    $.getJSON('/static/json_files/philippines_addresses/citymun.json', function (data) {
        $.each( data, function( key, val ) {
            city.push({
                muncity_id:val.citymunCode,
                province_id:val.provCode,
                code:val.psgcCode,
                description:val.citymunDesc
            })
        });
        get_city_list()
    })
    $.getJSON('/static/json_files/philippines_addresses/brgy.json', function (data) {
        $.each( data, function( key, val ) {
            barangay.push({
                muncity_id:val.citymunCode,
                code:val.brgyCode,
                description:val.brgyDesc
            })
        });
        get_barangay_list()
    })

    // On change event for select_region with functions
    $(select_region).on('change', function (){
        let items = ''
        let region_name = $(this).val()
        let region_id = 0
        $.each( region, function( key, val ) {
            if (val.description === region_name){
                region_id = val.region_id
                $('#region_code').val(val.code)
            }
        });
        $.each( province, function( key, val ) {
            if (val.region_id === region_id){
                items += '<option value="' + val.description + '" >' + val.description + '</option>'
            }
        });
        $(select_barangay).html('<option label="Label"></option>');
        $(select_barangay).attr('disabled', true);
        $(select_city).html('<option label="Label"></option>');
        $(select_city).attr('disabled', true);
        $(select_province).html('<option label="Label"></option>');
        $(select_province).attr('disabled', false);
        $(select_province).append(items);
    })

    // On change event for select_province with functions
    $(select_province).on('change', function (){
        let items = ''
        let province_name = $(this).val()
        let province_id = 0
        $.each( province, function( key, val ) {
            if (val.description === province_name){
                province_id = val.province_id
                $('.provincial_code').val(val.code)
            }
        });
        $.each( city, function( key, val ) {
            if (val.province_id === province_id){
                items += '<option value="' + val.description + '" >' + val.description + '</option>'
            }
        });
        $(select_barangay).html('<option label="Label"></option>');
        $(select_barangay).attr('disabled', true);
        $(select_city).html('<option label="Label"></option>');
        $(select_city).attr('disabled', false);
        $(select_city).append(items);
        $('#unit_name').val(province_name)
        generate_username_password(province_name)
    })

    // On change event for select_city with functions
    $(select_city).on('change', function (){
        let items = ''
        let city_name = $(this).val()
        let province_name = $(select_province).val()
        let city_id = 0
        $.each( city, function( key, val ) {
            if (val.description === city_name){
                city_id = val.muncity_id
                $('.city_code').val(val.code)
            }
        });
        $.each( barangay, function( key, val ) {
            if (val.muncity_id === city_id){
                items += '<option value="' + val.description + '" >' + val.description + '</option>'
            }
        });
        $(select_barangay).html('<option label="Label"></option>');
        $(select_barangay).attr('disabled', false);
        $(select_barangay).append(items);
        $('#unit_name').val(city_name)
        if (existing_province){
            province_name = existing_province
        }
        generate_username_password(city_name + province_name)
    })

    // On change event for select_barangay with functions
    $(select_barangay).on('change', function (){
        let barangay_name = $(this).val()
        let city_name = $(select_city).val()
        $.each( barangay, function( key, val ) {
            if (val.description === barangay_name){
                $('.barangay_code').val(val.code)
            }
        });
        $('#unit_name').val(barangay_name)
        if (existing_city){
            city_name = existing_city
        }
        generate_username_password(barangay_name + city_name)
    })

    // Function for existing province
    function get_city_list(){
        if (existing_province){
            let items = ''
            let province_name = existing_province
            let province_id = 0
            $.each( province, function( key, val ) {
                if (val.description === province_name){
                    province_id = val.province_id
                }
            });
            $.each( city, function( key, val ) {
                if (val.province_id === province_id){
                    items += '<option value="' + val.description + '" >' + val.description + '</option>'
                }
            });
            $(select_barangay).html('<option label="Label"></option>');
            $(select_barangay).attr('disabled', true);
            $(select_city).html('<option label="Label"></option>');
            $(select_city).attr('disabled', false);
            $(select_city).append(items);
        }
    }

    // Function for existing province
    function get_barangay_list(){
        if (existing_city){
            let items = ''
            let city_name = existing_city
            let city_id = 0
            $.each( city, function( key, val ) {
                if (val.description === city_name){
                    city_id = val.muncity_id
                    $('.city_code').val(val.code)
                }
            });
            $.each( barangay, function( key, val ) {
                if (val.muncity_id === city_id){
                    items += '<option value="' + val.description + '" >' + val.description + '</option>'
                }
            });
            $(select_barangay).html('<option label="Label"></option>');
            $(select_barangay).attr('disabled', false);
            $(select_barangay).append(items);
        }
    }
})
function generate_username_password(str){
    str = str.replace('(Capital)', '')
    $('#password').val(password_random(8))
    $('#username').val(generate_username(str.replace(/^(capital)/, "")))
    validated_username(generate_username(str.replace(/^(capital)/, "")))
}
function password_random(length) {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
function generate_username(string){
    let result           = '';
    result = string.replace(/\s/g, '').toLowerCase()
    return result;
}