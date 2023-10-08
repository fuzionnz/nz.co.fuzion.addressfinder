<?php

require_once 'addressfinder.civix.php';

/**
 * Implements hook_civicrm_config().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_config
 */
function addressfinder_civicrm_config(&$config) {
  _addressfinder_civix_civicrm_config($config);
}

function addressfinder_civicrm_coreResourceList(&$list, $region) {
  $key = Civi::settings()->get('address_finder_key');
  CRM_Core_Resources::singleton()->addVars('addressfinder', [
    'key' => $key,
  ]);
  $list[] = Civi::resources()->getUrl('nz.co.fuzion.addressfinder', 'js/addressfinder.api.js');
  $list[] = Civi::resources()->getUrl('nz.co.fuzion.addressfinder', 'js/addressfinder.init.js');
}

/**
 * Implements hook_civicrm_install().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_install
 */
function addressfinder_civicrm_install() {
  _addressfinder_civix_civicrm_install();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_enable
 */
function addressfinder_civicrm_enable() {
  _addressfinder_civix_civicrm_enable();
}
