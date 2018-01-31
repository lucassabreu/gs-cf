import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

/**
 * @param {String} url 
 * @param {String} pathname 
 */
const equals = (url, pathname) => url === pathname;
/**
 * @param {String} url 
 * @param {String} pathname 
 */
const startsWith = (url, pathname) => pathname.startsWith(url);

const DefaultRender = ({ name, url, active }) => (
  <li className={`nav-item ${active ? 'active' : ''}`}>
    <Link className="btn nav-link" to={url}>{name}</Link>
  </li>
);

const mapItem = (Component, pathname) => ({ url, isActive, ...restProps }) => (
  <Component key={url} url={url} active={isActive && isActive(url, pathname)} {...restProps} />
);

const ActiveLinkList = ({ itens, pathname, render: RenderItem, ...restProps }) => (
  itens.map(mapItem(RenderItem || DefaultRender, pathname))
)

ActiveLinkList.propTypes = {
  itens: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isActive: PropTypes.func.isRequired,
  })),
  pathname: PropTypes.string,
  render: PropTypes.func
}


export default ActiveLinkList
export { equals, startsWith, DefaultRender }
