let ue = window.ue;
export default function initUe5() {
  'object' !== typeof ue || 'object' !== typeof ue.interface
    ? ('object' !== typeof ue && (ue = {}),
      (ue.interface = {}),
      (ue.interface.broadcast = function (e: any, t: any) {
        if ('string' === typeof e) {
          var o = [e, ''];
          void 0 !== t && (o[1] = t);
          var n = encodeURIComponent(JSON.stringify(o));
          'object' == typeof history && 'function' == typeof history.pushState
            ? (history.pushState({}, '', '#' + n), history.pushState({}, '', '#' + encodeURIComponent('[]')))
            : ((document.location.hash = n), (document.location.hash = encodeURIComponent('[]')));
        }
      }))
    : (function (e) {
        (ue.interface = {}),
          (ue.interface.broadcast = function (t: any, o: any) {
            'string' === typeof t && (void 0 !== o ? e.broadcast(t, JSON.stringify(o)) : e.broadcast(t, ''));
          });
      })(ue.interface),
    (window.ue4 = ue.interface.broadcast);
}
