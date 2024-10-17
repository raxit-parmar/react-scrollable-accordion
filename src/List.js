import PropTypes from "prop-types";
import React, { useRef } from "react";

import ListHeader from "./ListHeader";
import styles from "./constants";

/**
 * The list with scrolling and a wrapper
 * @param {({
 *  children: [React.ReactNode] | React.ReactNode,
 *  className?: string,
 *  component?: string,
 *  label?: string,
 *  scrollBehavior?: "auto" | "smooth",
 *  stickyHeaders?: boolean,
 *  stickTo?: "all" | "bottom" | "top",
 * })} props
 *
 * @returns {React.ReactNode}
 */
const List = ({
  children,
  className,
  component: Component,
  label,
  scrollBehavior,
  stickyHeaders,
  stickTo
}) => {
  const listRef = useRef();
  let index = 0;
  const headers = [];

  const getStickedHeadersTotalHeight = (start, end) =>
    headers
      .slice(start, end)
      .reduce(
        (acc, header) => acc + header.current.getBoundingClientRect().height,
        0
      );

  const addHeader = ref => {
    headers.push(ref);
  };

  const getTotalHeaders = () => headers.length;

  const nodes = stickyHeaders
    ? React.Children.map(children, child => {
        if (child && child.type === ListHeader) {
          const header = React.cloneElement(child, {
            addHeader,
            getStickedHeadersTotalHeight,
            getTotalHeaders,
            index,
            listRef,
            stickTo
          });

          index += 1;

          return header;
        }
        return child;
      })
    : children;

  return (
    <div style={styles.Wrapper}>
      <Component
        /* eslint-disable react/jsx-props-no-spreading */
        {...(label ? { "aria-label": label } : {})}
        {...(className ? { className } : {})}
        /* eslint-enable react/jsx-props-no-spreading */
        ref={listRef}
        role="list"
        style={{ ...styles.List, scrollBehavior }}
        tabIndex="0"
      >
        {nodes}
      </Component>
    </div>
  );
};

List.propTypes = {
  /** List items */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  /** Optional class name for the List component */
  className: PropTypes.string,
  /** Default HTML tag name for the list */
  component: PropTypes.string,
  /** Optional ARIA label value */
  label: PropTypes.string,
  /** Sets the behavior for a scrolling box ("auto", "smooth") */
  scrollBehavior: PropTypes.oneOf(["auto", "smooth"]),
  /** Whether the header items should stick to top/bottom edges of the list */
  stickyHeaders: PropTypes.bool,
  /** Whether headers should stick to bottom/top only, or to both sides */
  stickTo: PropTypes.oneOf(["all", "bottom", "top"])
};

List.defaultProps = {
  className: "",
  component: "ul",
  label: "",
  scrollBehavior: "auto",
  stickyHeaders: false,
  stickTo: "all"
};

export default List;
