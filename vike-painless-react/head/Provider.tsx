import type { PropsWithChildren } from 'react';
import React, { Component } from 'react';

import HeadData, { isDocument } from './HeadData.js';
import type { HeadServerState } from './types.d.ts';
import { getGlobalObject } from '../renderer/utils/getGlobalObject'

const defaultValue = {};

export const { Context } = getGlobalObject('Provider.ts', {
  Context: React.createContext(defaultValue)
})
interface ProviderProps {
  context?: {
    head: HeadServerState;
  };
}

export default class HeadProvider extends Component<PropsWithChildren<ProviderProps>> {
  static canUseDOM = isDocument;

  headData: HeadData;

  constructor(props: ProviderProps) {
    super(props);

    this.headData = new HeadData(this.props.context || {}, HeadProvider.canUseDOM);
  }

  render() {
    return <Context.Provider value={this.headData.value}>{this.props.children}</Context.Provider>;
  }
}
