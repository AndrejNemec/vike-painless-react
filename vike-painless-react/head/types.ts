import type { HTMLAttributes, JSX } from 'react';

import type HeadData from './HeadData.d.ts';

export type Attributes = { [key: string]: string };

interface OtherElementAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

export type HtmlProps = JSX.IntrinsicElements['html'] & OtherElementAttributes;

export type BodyProps = JSX.IntrinsicElements['body'] & OtherElementAttributes;

export type LinkProps = JSX.IntrinsicElements['link'];

export type MetaProps = JSX.IntrinsicElements['meta'] & {
  charset?: string | undefined;
  'http-equiv'?: string | undefined;
  itemprop?: string | undefined;
};

export type TitleProps = HTMLAttributes<HTMLTitleElement>;

export interface HeadTags {
  baseTag: HTMLBaseElement[];
  linkTags: HTMLLinkElement[];
  metaTags: HTMLMetaElement[];
  noscriptTags: HTMLElement[];
  scriptTags: HTMLScriptElement[];
  styleTags: HTMLStyleElement[];
}

export interface HeadDatum {
  toString(): string;
  toComponent(): React.Component<any>;
}

export interface HeadHTMLBodyDatum {
  toString(): string;
  toComponent(): React.HTMLAttributes<HTMLBodyElement>;
}

export interface HeadHTMLElementDatum {
  toString(): string;
  toComponent(): React.HTMLAttributes<HTMLHtmlElement>;
}

export interface HeadServerState {
  base: HeadDatum;
  bodyAttributes: HeadHTMLBodyDatum;
  htmlAttributes: HeadHTMLElementDatum;
  link: HeadDatum;
  meta: HeadDatum;
  noscript: HeadDatum;
  script: HeadDatum;
  style: HeadDatum;
  title: HeadDatum;
  titleAttributes: HeadDatum;
  priority: HeadDatum;
}

export type MappedServerState = HeadProps & HeadTags & { encode?: boolean };

export interface TagList {
  [key: string]: HTMLElement[];
}

export interface StateUpdate extends HeadTags {
  bodyAttributes: BodyProps;
  defer: boolean;
  htmlAttributes: HtmlProps;
  onChangeClientState: (newState: StateUpdate, addedTags: TagList, removedTags: TagList) => void;
  title: string;
  titleAttributes: TitleProps;
}

export interface HeadProps {
  async?: boolean;
  base?: Attributes; // {"target": "_blank", "href": "http://mysite.com/"}
  bodyAttributes?: BodyProps; // {"className": "root"}
  defaultTitle?: string; // "Default Title"
  defer?: boolean; // Default: true
  encodeSpecialCharacters?: boolean; // Default: true
  headData?: HeadData;
  htmlAttributes?: HtmlProps; // {"lang": "en", "amp": undefined}
  // "(newState) => console.log(newState)"
  onChangeClientState?: (
    newState: StateUpdate,
    addedTags: HeadTags,
    removedTags: HeadTags
  ) => void;
  link?: LinkProps[]; // [{"rel": "canonical", "href": "http://mysite.com/example"}]
  meta?: MetaProps[]; // [{"name": "description", "content": "Test description"}]
  noscript?: Attributes[]; // [{"innerHTML": "<img src='http://mysite.com/js/test.js'"}]
  script?: Attributes[]; // [{"type": "text/javascript", "src": "http://mysite.com/js/test.js"}]
  style?: Attributes[]; // [{"type": "text/css", "cssText": "div { display: block; color: blue; }"}]
  title?: string; // "Title"
  titleAttributes?: Attributes; // {"itemprop": "name"}
  titleTemplate?: string; // "MySite.com - %s"
  prioritizeSeoTags?: boolean; // Default: false
}
