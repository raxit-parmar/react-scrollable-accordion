import React from "react";

import { cleanup, render, wait } from "@testing-library/react";
import "@testing-library/jest-dom";

import List from "./List";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";

// Window height is 120px
window.innerHeight = 120;

// List item (li) height is 30px
const itemHeight = 30;

const listItems = [
  <ListHeader key={0}>Header 1</ListHeader>,
  <ListItem key={1}>Item 1</ListItem>,
  <ListItem key={2}>Item 2</ListItem>,
  <ListItem key={3}>Item 3</ListItem>,
  <ListHeader key={4}>Header 2</ListHeader>,
  <ListItem key={5}>Item 4</ListItem>,
  <ListItem key={6}>Item 5</ListItem>,
  <ListItem key={7}>Item 6</ListItem>,
  <ListItem key={8}>Item 7</ListItem>,
  <ListHeader key={9}>Header 3</ListHeader>,
  <ListItem key={10}>Item 8</ListItem>,
  <ListItem key={11}>Item 9</ListItem>,
  <ListItem key={12}>Item 10</ListItem>,
  <ListItem key={13}>Item 11</ListItem>,
  <ListItem key={14}>Item 12</ListItem>
];

const getChildIndex = element =>
  [].findIndex.call(element.parentNode.children, child => child === element);

Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    height: itemHeight
  };
};

Object.defineProperties(window.HTMLElement.prototype, {
  offsetHeight: {
    get() {
      return parseFloat(window.getComputedStyle(this).height) || 0;
    }
  },
  offsetTop: {
    get() {
      return getChildIndex(this) * itemHeight;
    }
  }
});

afterEach(cleanup);

const renderStickyHeadersList = () => {
  const { getByText, getByTestId } = render(
    <div data-testid="list">
      <List stickyHeaders>{listItems}</List>
    </div>
  );

  document.getElementsByTagName("ul")[0].style.height = "120px";

  return { getByText, getByTestId };
};

test("should render a regular List", async () => {
  const { getByText } = render(<List>{listItems}</List>);

  await wait(() => {
    const firstHeaderNode = getByText("Header 1");
    const firstHeaderStyle = window.getComputedStyle(firstHeaderNode);
    expect(firstHeaderNode.parentElement.tagName).toBe("UL");
    expect(firstHeaderStyle.position).toBe("relative");

    const middleHeaderNode = getByText("Header 2");
    const middleHeaderStyle = window.getComputedStyle(middleHeaderNode);
    expect(middleHeaderStyle.position).toBe("relative");

    const lastHeaderNode = getByText("Header 3");
    const lastHeaderStyle = window.getComputedStyle(lastHeaderNode);
    expect(lastHeaderStyle.position).toBe("relative");
  });
});

test("should render List with Header 1 on top, Header 2 and Header 3 on bottom", async () => {
  const { getByText } = renderStickyHeadersList();

  await wait(() => {
    const firstHeaderNode = getByText("Header 1");
    const firstHeaderStyle = window.getComputedStyle(firstHeaderNode);

    expect(firstHeaderStyle.position).toBe("absolute");
    expect(firstHeaderStyle.top).toBe("0px");

    const middleHeaderNode = getByText("Header 2");
    const middleHeaderStyle = window.getComputedStyle(middleHeaderNode);

    expect(middleHeaderStyle.position).toBe("absolute");
    expect(middleHeaderStyle.bottom).toBe("30px");
    expect(middleHeaderStyle.top).toBeFalsy();

    const lastHeaderNode = getByText("Header 3");
    const lastHeaderStyle = window.getComputedStyle(lastHeaderNode);

    expect(lastHeaderStyle.position).toBe("absolute");
    expect(lastHeaderStyle.bottom).toBe("0px");
    expect(lastHeaderStyle.top).toBeFalsy();
  });
});

test("should render List with Header 1 on top, scrollable Header 2, Header 3 on bottom", async () => {
  const { getByText, getByTestId } = renderStickyHeadersList();

  getByTestId("list").firstChild.firstChild.scrollTop = 40;

  await wait(() => {
    const firstHeaderNode = getByText("Header 1");
    const firstHeaderStyle = window.getComputedStyle(firstHeaderNode);

    expect(firstHeaderStyle.position).toBe("absolute");
    expect(firstHeaderStyle.top).toBe("0px");

    const middleHeaderNode = getByText("Header 2");
    const middleHeaderStyle = window.getComputedStyle(middleHeaderNode);

    expect(middleHeaderStyle.position).toBe("");
    expect(middleHeaderStyle.bottom).toBeFalsy();
    expect(middleHeaderStyle.top).toBeFalsy();

    const lastHeaderNode = getByText("Header 3");
    const lastHeaderStyle = window.getComputedStyle(lastHeaderNode);

    expect(lastHeaderStyle.position).toBe("absolute");
    expect(lastHeaderStyle.bottom).toBe("0px");
    expect(lastHeaderStyle.top).toBeFalsy();
  });
});

test("should render List with Header 1 and Header 2 on top, Header 3 on bottom", async () => {
  const { getByText, getByTestId } = renderStickyHeadersList();

  getByTestId("list").firstChild.firstChild.scrollTop = 80;

  await wait(() => {
    const firstHeaderNode = getByText("Header 1");
    const firstHeaderStyle = window.getComputedStyle(firstHeaderNode);
    expect(firstHeaderStyle.position).toBe("absolute");
    expect(firstHeaderStyle.top).toBe("0px");

    const middleHeaderNode = getByText("Header 2");
    const middleHeaderStyle = window.getComputedStyle(middleHeaderNode);
    expect(middleHeaderStyle.position).toBe("absolute");
    expect(middleHeaderStyle.bottom).toBeFalsy();
    expect(middleHeaderStyle.top).toBe("30px");

    const lastHeaderNode = getByText("Header 3");
    const lastHeaderStyle = window.getComputedStyle(lastHeaderNode);
    expect(lastHeaderStyle.position).toBe("absolute");
    expect(lastHeaderStyle.bottom).toBe("0px");
    expect(lastHeaderStyle.top).toBeFalsy();
  });
});

test("should render List with Header 1 and Header 2 on top, scrollable Header 3", async () => {
  const { getByText, getByTestId } = renderStickyHeadersList();

  getByTestId("list").firstChild.firstChild.scrollTop = 120;

  await wait(() => {
    const firstHeaderNode = getByText("Header 1");
    const firstHeaderStyle = window.getComputedStyle(firstHeaderNode);
    expect(firstHeaderStyle.position).toBe("absolute");
    expect(firstHeaderStyle.top).toBe("0px");

    const middleHeaderNode = getByText("Header 2");
    const middleHeaderStyle = window.getComputedStyle(middleHeaderNode);
    expect(middleHeaderStyle.position).toBe("absolute");
    expect(middleHeaderStyle.bottom).toBeFalsy();
    expect(middleHeaderStyle.top).toBe("30px");

    const lastHeaderNode = getByText("Header 3");
    const lastHeaderStyle = window.getComputedStyle(lastHeaderNode);
    expect(lastHeaderStyle.position).toBe("");
    expect(lastHeaderStyle.bottom).toBeFalsy();
    expect(lastHeaderStyle.top).toBeFalsy();
  });
});

test("should render List with Header 1, Header 2 and Header 3 on top", async () => {
  const { getByText, getByTestId } = renderStickyHeadersList();

  getByTestId("list").firstChild.firstChild.scrollTop = 160;

  await wait(() => {
    const firstHeaderNode = getByText("Header 1");
    const firstHeaderStyle = window.getComputedStyle(firstHeaderNode);
    expect(firstHeaderStyle.position).toBe("absolute");
    expect(firstHeaderStyle.top).toBe("0px");

    const middleHeaderNode = getByText("Header 2");
    const middleHeaderStyle = window.getComputedStyle(middleHeaderNode);
    expect(middleHeaderStyle.position).toBe("absolute");
    expect(middleHeaderStyle.bottom).toBeFalsy();
    expect(middleHeaderStyle.top).toBe("30px");

    const lastHeaderNode = getByText("Header 3");
    const lastHeaderStyle = window.getComputedStyle(lastHeaderNode);
    expect(lastHeaderStyle.position).toBe("absolute");
    expect(lastHeaderStyle.bottom).toBeFalsy();
    expect(lastHeaderStyle.top).toBe("60px");
  });
});

test("should render List with DIV wrapper element", () => {
  const { getByText } = render(
    <List className="test-classname" component="div" stickyHeaders>
      {listItems}
    </List>
  );

  const firstHeaderNode = getByText("Header 1");
  const listNode = firstHeaderNode.parentElement;
  expect(listNode.tagName).toBe("DIV");
  expect(listNode.classList.length).toBe(1);
  expect(listNode.classList[0]).toBe("test-classname");
});
