<?php

/**
 * Administrative settings for FBSSTS.
 */

/**
 * The admin settings form.
 */
function fbssts_admin(&$form_state) {
  $form = array();
  $form['fbssts_count'] = array(
    '#type' => 'select',
    '#title' => t('Number of tags to suggest'),
    '#default_value' => variable_get('fbssts_count', 5),
    '#options' => drupal_map_assoc(range(1, 20)),
  );
  $form['fbssts_time'] = array(
    '#type' => 'textfield',
    '#title' => t('Popular since'),
    '#description' => t('Only consider statuses submitted within this time period while looking for popular tags. Leave this blank to consider all statuses from any time.'),
    '#field_suffix' => ' '. t('seconds'),
    '#default_value' => variable_get('fbssts_time', 604800),
  );
  return system_settings_form($form);
}

/**
 * Validate the admin settings form.
 */
function fbssts_admin_validate($form, $form_state) {
  $v = $form_state['values']['fbssts_time'];
  if (!is_numeric($v) || $v <= 0) {
    form_set_error('fbssts_time', t('The "Popular since" time must be a positive integer.'));
  }
}
