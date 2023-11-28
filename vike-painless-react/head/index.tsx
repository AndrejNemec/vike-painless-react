import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import React, { Component } from 'react';
import fastCompare from 'react-fast-compare';
import invariant from 'invariant';

import { Context } from './Provider.js';
import type { HeadDataType } from './HeadData.js';
import HeadData from './HeadData.js';
import type { DispatcherContextProp } from './Dispatcher.js';
import Dispatcher from './Dispatcher.js';
import { without } from './utils.js';
import { TAG_NAMES, VALID_TAG_NAMES, HTML_TAG_MAP } from './constants.js';
import type { HeadProps } from './types.d.ts';

export * from './types.js';

export { default as HeadData } from './HeadData.js';
export { default as HeadProvider } from './Provider.js';

type Props = { [key: string]: any };

export class Head extends Component<PropsWithChildren<HeadProps>> {
  static defaultProps = {
    defer: true,
    encodeSpecialCharacters: true,
    prioritizeSeoTags: false,
  };

  shouldComponentUpdate(nextProps: HeadProps) {
    return !fastCompare(without(this.props, 'headData'), without(nextProps, 'headData'));
  }

  mapNestedChildrenToProps(child: ReactElement, nestedChildren: ReactNode) {
    if (!nestedChildren) {
      return null;
    }

    switch (child.type) {
      case TAG_NAMES.SCRIPT:
      case TAG_NAMES.NOSCRIPT:
        return {
          innerHTML: nestedChildren,
        };

      case TAG_NAMES.STYLE:
        return {
          cssText: nestedChildren,
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }

  flattenArrayTypeChildren(
    child: JSX.Element,
    arrayTypeChildren: { [key: string]: JSX.Element[] },
    newChildProps: Props,
    nestedChildren: ReactNode
  ) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...(arrayTypeChildren[child.type] || []),
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren),
        },
      ],
    };
  }

  mapObjectTypeChildren(
    child: JSX.Element,
    newProps: Props,
    newChildProps: Props,
    nestedChildren: ReactNode
  ) {
    switch (child.type) {
      case TAG_NAMES.TITLE:
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps },
        };

      case TAG_NAMES.BODY:
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps },
        };

      case TAG_NAMES.HTML:
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps },
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps },
        };
    }
  }

  mapArrayTypeChildrenToProps(arrayTypeChildren: { [key: string]: JSX.Element }, newProps: Props) {
    let newFlattenedProps = { ...newProps };

    Object.keys(arrayTypeChildren).forEach(arrayChildName => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName],
      };
    });

    return newFlattenedProps;
  }

  warnOnInvalidChildren(child: JSX.Element, nestedChildren: ReactNode) {
    invariant(
      VALID_TAG_NAMES.some(name => child.type === name),
      typeof child.type === 'function'
        ? `You may be attempting to nest <Head> components within each other, which is not allowed. Refer to our API for more information.`
        : `Only elements types ${VALID_TAG_NAMES.join(
            ', '
          )} are allowed. Head does not support rendering <${
            child.type
          }> elements. Refer to our API for more information.`
    );

    invariant(
      !nestedChildren ||
        typeof nestedChildren === 'string' ||
        (Array.isArray(nestedChildren) &&
          !nestedChildren.some(nestedChild => typeof nestedChild !== 'string')),
      `Head expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );

    return true;
  }

  mapChildrenToProps(children: ReactNode, newProps: Props) {
    let arrayTypeChildren = {};

    React.Children.forEach(children as JSX.Element, (child: ReactElement) => {
      if (!child || !child.props) {
        return;
      }

      const { children: nestedChildren, ...childProps } = child.props;
      // convert React props to HTML attributes
      const newChildProps = Object.keys(childProps).reduce((obj: Props, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});

      let { type } = child;
      if (typeof type === 'symbol') {
        type = (type as 'symbol').toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }

      switch (type) {
        case TAG_NAMES.FRAGMENT:
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;

        case TAG_NAMES.LINK:
        case TAG_NAMES.META:
        case TAG_NAMES.NOSCRIPT:
        case TAG_NAMES.SCRIPT:
        case TAG_NAMES.STYLE:
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;

        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });

    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }

  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { headData } = props;

    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }

    if (headData && !(headData instanceof HeadData)) {
      const data = headData as HeadDataType;
      headData = new HeadData(data.context, true);
      delete newProps.headData;
    }

    return headData ? (
      <Dispatcher {...newProps} context={headData.value} />
    ) : (
      <Context.Consumer>
        {context => <Dispatcher {...newProps} context={context as DispatcherContextProp} />}
      </Context.Consumer>
    );
  }
}
