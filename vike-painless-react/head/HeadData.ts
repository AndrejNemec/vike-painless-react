import type HeadDispatcher from './Dispatcher.js';
import mapStateOnServer from './server.js';
import type { HeadServerState, MappedServerState } from './types.d.ts';

const instances: HeadDispatcher[] = [];

export function clearInstances() {
  instances.length = 0;
}

export interface HeadDataType {
  instances: HeadDispatcher[];
  context: HeadDataContext;
}

interface HeadDataContext {
  head: HeadServerState;
}

export const isDocument = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default class HeadData implements HeadDataType {
  instances = [];
  canUseDOM = isDocument;
  context: HeadDataContext;

  value = {
    setHead: (serverState: HeadServerState) => {
      this.context.head = serverState;
    },
    headInstances: {
      get: () => (this.canUseDOM ? instances : this.instances),
      add: (instance: HeadDispatcher) => {
        (this.canUseDOM ? instances : this.instances).push(instance);
      },
      remove: (instance: HeadDispatcher) => {
        const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
        (this.canUseDOM ? instances : this.instances).splice(index, 1);
      },
    },
  };

  constructor(context: any, canUseDOM?: boolean) {
    this.context = context;
    this.canUseDOM = canUseDOM || false;

    if (!canUseDOM) {
      context.head = mapStateOnServer({
        baseTag: [],
        bodyAttributes: {},
        encodeSpecialCharacters: true,
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: '',
        titleAttributes: {},
      } as MappedServerState);
    }
  }
}
