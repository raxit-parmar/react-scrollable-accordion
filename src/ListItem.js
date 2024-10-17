import PropTypes from "prop-types";
import React from "react";

/**
 * @param {({
 *  children?: [React.ReactNode] | React.ReactNode,
 *  className?: string,
 *  component?: string
 * })} props
 *
 * @returns {React.ReactNode}
 */
const ListItem = ({ children, className, component: Component }) => (
  <Component
    aria-level="1"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...(className ? { className } : {})}
    role="listitem"
  >
    {children}
  </Component>
);

ListItem.propTypes = {
  /** List item children */
  children: PropTypes.node,
  /** Optional class name for the ListItem component */
  className: PropTypes.string,
  /** Default HTML tag name for the ListItem component */
  component: PropTypes.string
};

ListItem.defaultProps = {
  children: [],
  className: "",
  component: "li"
};

export default ListItem;
