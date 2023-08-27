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
 * Implements hook_civicrm_uninstall().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_uninstall
 */
function addressfinder_civicrm_uninstall() {
  _addressfinder_civix_civicrm_uninstall();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_enable
 */
function addressfinder_civicrm_enable() {
  _addressfinder_civix_civicrm_enable();
}

/**
 * Implements hook_civicrm_disable().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_disable
 */
function addressfinder_civicrm_disable() {
  _addressfinder_civix_civicrm_disable();
}

/**
 * Implements hook_civicrm_upgrade().
 *
 * @param $op string, the type of operation being performed; 'check' or 'enqueue'
 * @param $queue CRM_Queue_Queue, (for 'enqueue') the modifiable list of pending up upgrade tasks
 *
 * @return mixed
 *   Based on op. for 'check', returns array(boolean) (TRUE if upgrades are pending)
 *                for 'enqueue', returns void
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_upgrade
 */
function addressfinder_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _addressfinder_civix_civicrm_upgrade($op, $queue);
}

/**
 * Functions below this ship commented out. Uncomment as required.
 *

/**
 * Implements hook_civicrm_preProcess().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_preProcess
 *

 // */

/**
 * Implements hook_civicrm_navigationMenu().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_navigationMenu
 *
function addressfinder_civicrm_navigationMenu(&$menu) {
  _addressfinder_civix_insert_navigation_menu($menu, NULL, array(
    'label' => ts('The Page', array('domain' => 'nz.co.fuzion.addressfinder')),
    'name' => 'the_page',
    'url' => 'civicrm/the-page',
    'permission' => 'access CiviReport,access CiviContribute',
    'operator' => 'OR',
    'separator' => 0,
  ));
  _addressfinder_civix_navigationMenu($menu);
} // */

/**
 * Implements hook_civicrm_postInstall().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_postInstall
 */
function addressfinder_civicrm_postInstall() {
  _addressfinder_civix_civicrm_postInstall();
}

/**
 * Implements hook_civicrm_entityTypes().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_entityTypes
 */
function addressfinder_civicrm_entityTypes(&$entityTypes) {
  _addressfinder_civix_civicrm_entityTypes($entityTypes);
}
