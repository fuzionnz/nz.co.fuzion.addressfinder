CRM.$(function($) {
    var key = CRM.vars.addressfinder.key;

    const COUNTRY_ID = 1154;

    createWidgets();
    $('[id^="address-block"], [id^="addMoreAddress"], [id^="addressBlockId"]').click(function() {
      createWidgets();
    });

    // setInterval(createWidgets, 500); // Hacky - need a better way to listen for new DOM elements

    /**
     * Sets readonly if the element value is not empty
     * @param $el
     */
    function setReadOnly($el, val = 'readonly') {
      $el.prop('readonly', val);
    }

    function setValueAndDisable($el = null, val = false, readonly = 'readonly') {
      if ($el == null) {
        return;
      }
      $el.val(val);
      setReadOnly($el, readonly);
    }

    $('[id*="_street_address"]').on('change', function() {
      var number = $(this).attr('id').split('_')[1];
      if ($(this).val().trim() === '') {
        setValueAndDisable($('#address_' + number + '_city'), '');
        setValueAndDisable($('#address_' + number + '_postal_code'), '');
        setValueAndDisable($('#address_' + number + '_state_province_id'), '');
      }
    });

    function createWidgets() {
      for (var id = 1; id < 10; id++) {
        var el = $('#address_table_' + id);
        if (el.length != 1) {
          continue;
        }
        el = el[0];
        if ($(el).data('address-finder')) {
          continue;
        }
        $('#address_' + id + '_street_address', el).attr('placeholder', 'Start typing an address...');

        setReadOnly($('#address_' + id + '_city'));
        setReadOnly($('#address_' + id + '_postal_code'));
        // Need to capture the values of id and el, so we've wrapped this in a function.
        var init = function(el, id) {
          var widget = new AddressFinder.Widget(
            $('#address_' + id + '_street_address', el)[0],
            key,
            'US',
            {
              byline: false,
              max_results: 8,
              "address_params": {
                "delivered": "1"
              }
            }
          );

          widget.on('result:select', function(fullAddress, metadata) {
            $('#address_' + id + '_street_address', el).val(metadata.address.address_line_combined);
            // setValueAndDisable($('#address_' + id + '_supplemental_address_1', el), metadata.address.suburb);
            setValueAndDisable($('#address_' + id + '_city', el), metadata.address.city);
            setValueAndDisable($('#address_' + id + '_postal_code', el), metadata.address.postcode);
            setValueAndDisable($('#address_' + id + '_country_id', el), COUNTRY_ID);

            // Set state from abbreviation.
            if (metadata.address.hasOwnProperty('state')) {
              CRM.api3('StateProvince', 'get', {
                "sequential": 1,
                "country_id": COUNTRY_ID,
                "abbreviation": metadata.address.state
              }).then(function(result) {
                if (result.hasOwnProperty('id')) {
                  $('#address_' + id + '_state_province_id', el).val(result.id).change();
                }
              });
            }
          });

          $(el).data('address-finder', true);
        };

        init(el, id);
      }
    }

    // var profile = $('.billing_name_address-section, .crm-profile-id-116, .crm-profile-id-17, .crm-profile-id-18, .crm-profile-id-1, .crm-profile-id-46, .crm-profile-name-name_and_address');
    addAddressFinder($('.billing_name_address-section'), $('input[id^="billing_street_address-"]'));

    // When the payment processor is changed, wait for civicrm to render the billing profile.
    var changeTimeout;
    var isInputChangePending = false;
    $('input[name=payment_processor_id]').change(function(e) {
      isInputChangePending = true;
      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(function() {
        if (isInputChangePending) {
          addAddressFinder($('.billing_name_address-section'), $('input[id^="billing_street_address-"]'));
          isInputChangePending = false;
        }
      }, 1000);
    });

    var profile = $('[class*="crm-profile-id"]');
    var street_addr_field = $('input[id^="street_address-"]');
    addAddressFinder(profile, street_addr_field);


    function addAddressFinder(profile, street_addr_field) {
      var billing = '';
      if (profile.length > 0 && street_addr_field.length > 0) {
        var loctypeId = $('input[id^="street_address-"]').attr('id');
        var loctype = loctypeId.replace('street_address-', "");

        // If this is a billing address
        if (street_addr_field.attr('id') == 'billing_street_address-5') {
          loctype = 5;
          billing = 'billing_';
        }

        $('#' + billing + 'street_address-' + loctype, profile).attr('placeholder', 'Start typing an address...');
        var widget = new AddressFinder.Widget(
          $('#' + billing + 'street_address-' + loctype, profile)[0],
          key,
          'US',
          {
            byline: false,
            max_results: 8,
            "address_params": {
              "delivered": "1"
            }
          }
        );
        widget.on('result:select', function(fullAddress, metaData) {
          $('#' + billing + 'street_address-' + loctype, profile).val(metaData.address.address_line_combined);
          setValueAndDisable($('#' + billing + 'city-' + loctype, profile), metaData.address.city);
          setValueAndDisable($('#' + billing + 'postal_code-' + loctype, profile), metaData.address.postcode);
          setValueAndDisable($('#' + billing + 'country-' + loctype, profile), COUNTRY_ID);

          // Set state from abbreviation.
          if (metaData.address.hasOwnProperty('state')) {
            CRM.api3('StateProvince', 'get', {
              "sequential": 1,
              "country_id": COUNTRY_ID,
              "abbreviation": metaData.address.state
            }).then(function(result) {
              if (result.hasOwnProperty('id')) {
                $('#' + billing + 'state_province_id-' + loctype, profile).val(result.id).change();
              }
            });
          }
        });

        $('#' + billing + 'street_address-' + loctype, profile).change(function(e) {
          if (!$(this).val()) {
            setValueAndDisable($('#' + billing + 'supplemental_address_1-' + loctype, profile), '');
            setValueAndDisable($('#' + billing + 'city-' + loctype, profile), '');
            setValueAndDisable($('#' + billing + 'postal_code-' + loctype, profile), '');
          }
        });

        $('#' + billing + 'country-' + loctype).change(function(e) {
          if ($(this).val() == COUNTRY_ID) {
            $('#' + billing + 'street_address-' + loctype, profile).attr('placeholder', 'Start typing an address...');
            setReadOnly($('#' + billing + 'supplemental_address_1-' + loctype, profile));
            setReadOnly($('#' + billing + 'city-' + loctype, profile));
            setReadOnly($('#' + billing + 'postal_code-' + loctype, profile));
            e.preventDefault();
            widget.enable();
          }
          else {
            $('#' + billing + 'street_address-' + loctype, profile).removeAttr('placeholder');
            $('#' + billing + 'street_address-' + loctype, profile).val('');
            setValueAndDisable($('#' + billing + 'supplemental_address_1-' + loctype, profile), '', false);
            setValueAndDisable($('#' + billing + 'city-' + loctype, profile), '', false);
            setValueAndDisable($('#' + billing + 'postal_code-' + loctype, profile), '', false);
            e.preventDefault();
            widget.disable();
          }
        });

      }
    }


});
