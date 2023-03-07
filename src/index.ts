import MassagePorter from './parent';
import IframePort from './child';
import $eventBus from './event';
import initUe5 from './useUe5';
import './global';

initUe5();

export {MassagePorter, IframePort, $eventBus};
