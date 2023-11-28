import { Component } from 'react';
import shallowEqual from 'shallowequal';

import handleStateChangeOnClient from './client.js';
import mapStateOnServer from './server.js';
import { reducePropsToState } from './utils.js';
import Provider from './Provider.js';
import type { HeadServerState } from './types.d.ts';

export interface DispatcherContextProp {
  setHead: (newState: HeadServerState) => void;
  headInstances: {
    get: () => HeadDispatcher[];
    add: (head: HeadDispatcher) => void;
    remove: (head: HeadDispatcher) => void;
  };
}

interface DispatcherProps {
  context: DispatcherContextProp;
}

export default class HeadDispatcher extends Component<DispatcherProps> {
  rendered = false;

  shouldComponentUpdate(nextProps: DispatcherProps) {
    return !shallowEqual(nextProps, this.props);
  }

  componentDidUpdate() {
    this.emitChange();
  }

  componentWillUnmount() {
    const { headInstances } = this.props.context;
    headInstances.remove(this);
    this.emitChange();
  }

  emitChange() {
    const { headInstances, setHead } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      headInstances.get().map(instance => {
        const props = { ...instance.props };
        // @ts-ignore
        delete props.context;
        return props;
      })
    );
    if (Provider.canUseDOM) {
      handleStateChangeOnClient(state);
    } else if (mapStateOnServer) {
      serverState = mapStateOnServer(state);
    }
    // @ts-ignore
    setHead(serverState);
  }

  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }

    this.rendered = true;

    const { headInstances } = this.props.context;
    headInstances.add(this);
    this.emitChange();
  }

  render() {
    this.init();

    return null;
  }
}
