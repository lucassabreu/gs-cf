import React from 'react';
import { ListGroupItemText } from 'reactstrap';

const getByKey = (key) => (value) => value[key];
const defaultLabel = (key) => (value) => <ListGroupItemText children={value[key]} />

/**
 * @param {Object} params
 * @param {any[]} params.data
 * @param {String|Function} params.label
 * @param {String|Function} params.value
 * @param {String|Function} params.key
 */
const getRows = ({ data, label, value, key }) => {
  const valueFn = value instanceof Function ? value : getByKey(value);
  const labelFn = label instanceof Function ? label : defaultLabel(label);
  const keyFn = key instanceof Function ? key : getByKey(key);

  return data.map((v) => ({ label: labelFn(v), value: valueFn(v), key: keyFn(v), data: v, }))
}

export { getRows, getByKey, defaultLabel }