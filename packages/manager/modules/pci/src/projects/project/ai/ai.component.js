import controller from './ai.controller';
import template from './ai.html';

export default {
  controller,
  template,
  bindings: {
    appsLink: '<',
    refreshState: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
};
