CRM.$(function($) {
  // Forms to ignore
  if ($('form#Domain').length > 0) {
    return;
  }

  CRM.api4('Setting', 'get', {
    select: ["defaultContactCountry"]
  }, 0).then(function(countrySetting) {
    const COUNTRY_ID = countrySetting.value;
    let COUNTRY;
    switch (COUNTRY_ID) {
      case '1154':
        COUNTRY = 'NZ';
        break;
      case '1013':
        COUNTRY = 'AU';
        break;
      case '1228':
        COUNTRY = 'US';
        break;
      default:
        console.error('Unsupported country ID:', COUNTRY_ID);
        return;
    }

    createWidgets();
    $('[id^="address-block"], [id^="addMoreAddress"], [id^="addressBlockId"]').click(function() {
      createWidgets();
    });

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
          return;
        }

        $('#address_' + id + '_street_address', el).attr('placeholder', 'Start typing an address...');

        setReadOnly($('#address_' + id + '_city'));
        setReadOnly($('#address_' + id + '_postal_code'));

        var init = function(el, id) {
          var widget = new AddressFinder.Widget(
            $('#address_' + id + '_street_address', el)[0],
            CRM.vars.addressfinder.key,
            COUNTRY,
            {
              byline: false,
              max_results: 8,
              "address_params": {
                "delivered": "1"
              }
            }
          );

          widget.on('result:select', function(fullAddress, metaData) {
            if (COUNTRY_ID == 1154) {
              var selected = new AddressFinder.NZSelectedAddress(fullAddress, metaData);
              $('#address_' + id + '_street_address', el).val(selected.address_line_1_and_2());
              setValueAndDisable($('#address_' + id + '_supplemental_address_1', el), selected.suburb());
              setValueAndDisable($('#address_' + id + '_city', el), selected.city());
              setValueAndDisable($('#address_' + id + '_postal_code', el), selected.postcode());
            }
            else {
              const address = metaData.address ?? metaData;
              const state = address.state_territory ?? address.state;

              $('#address_' + id + '_street_address', el).val(address.address_line_combined);
              setValueAndDisable($('#address_' + id + '_city', el), address.city ?? address.locality_name ?? '');
              setValueAndDisable($('#address_' + id + '_postal_code', el), address.postcode);

              if (state) {
                CRM.api3('StateProvince', 'get', {
                  "sequential": 1,
                  "country_id": COUNTRY_ID,
                  "abbreviation": state
                }).then(function(result) {
                  if (result.values.length > 0) {
                    $('#address_' + id + '_state_province_id', el).val(result.values[0].id).change();
                  }
                });
              }
            }
            setValueAndDisable($('#address_' + id + '_country_id', el), COUNTRY_ID);
          });

          $(el).data('address-finder', true);
        };

        init(el, id);
      }
    }

    addAddressFinder($('.billing_name_address-section'), $('input[id^="billing_street_address-"]'));

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

        if (street_addr_field.attr('id') == 'billing_street_address-5') {
          loctype = 5;
          billing = 'billing_';
        }

        $('#' + billing + 'street_address-' + loctype, profile).attr('placeholder', 'Start typing an address...');
        var widget = new AddressFinder.Widget(
          $('#' + billing + 'street_address-' + loctype, profile)[0],
          CRM.vars.addressfinder.key,
          COUNTRY,
          {
            byline: false,
            max_results: 8,
            "address_params": {
              "delivered": "1"
            }
          }
        );
        widget.on('result:select', function(fullAddress, metaData) {
          if (COUNTRY_ID == 1154) {
            var selected = new AddressFinder.NZSelectedAddress(fullAddress, metaData);
            $('#' + billing + 'street_address-' + loctype, profile).val(selected.address_line_1());
            setValueAndDisable($('#' + billing + 'supplemental_address_1-' + loctype, profile), selected.address_line_2() + " "  + selected.suburb());
            setValueAndDisable($('#' + billing + 'city-' + loctype, profile), selected.city());
            setValueAndDisable($('#' + billing + 'postal_code-' + loctype, profile), selected.postcode());
          }
          else {
            const address = metaData.address ?? metaData;
            const state = address.state_territory ?? address.state;

            $('#' + billing + 'street_address-' + loctype, profile).val(address.address_line_combined);
            setValueAndDisable($('#' + billing + 'city-' + loctype, profile),  address.city ?? address.locality_name ?? '');
            setValueAndDisable($('#' + billing + 'postal_code-' + loctype, profile), address.postcode);

            if (state) {
              CRM.api3('StateProvince', 'get', {
                "sequential": 1,
                "country_id": COUNTRY_ID,
                "abbreviation": state
              }).then(function(result) {
                if (result.values.length > 0) {
                  $('#' + billing + 'state_province_id-' + loctype, profile).val(result.values[0].id).change();
                }
              });
            }
          }

          setValueAndDisable($('#' + billing + 'country-' + loctype, profile), COUNTRY_ID);
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

  }, function(failure) {
    console.error('Failed to get default contact country setting', failure);
  });
});
