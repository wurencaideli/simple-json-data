/*!
 * simple-json-data v0.0.1
 * Copyright 2025 wuzhanggui https://github.com/wurencaideli
 * Licensed under MIT
 */
!(function (t, i) {
    'object' == typeof exports && 'undefined' != typeof module
        ? i(exports)
        : 'function' == typeof define && define.amd
        ? define(['exports'], i)
        : i(
              ((t = 'undefined' != typeof globalThis ? globalThis : t || self)['simple-json-data'] =
                  {}),
          );
})(this, function (t) {
    'use strict';
    function i(t, i, s, e) {
        if ('a' === s && !e) throw new TypeError('Private accessor was defined without a getter');
        if ('function' == typeof i ? t !== i || !e : !i.has(t))
            throw new TypeError(
                'Cannot read private member from an object whose class did not declare it',
            );
        return 'm' === s ? e : 'a' === s ? e.call(t) : e ? e.value : i.get(t);
    }
    var s, e, o, n;
    'function' == typeof SuppressedError && SuppressedError;
    (s = new WeakSet()),
        (e = function () {
            const t = this.target,
                i = !this.target,
                s = this.start + this.distance;
            this.isX
                ? i
                    ? window.scrollTo(s, window.scrollY)
                    : (t.scrollLeft = s)
                : i
                ? window.scrollTo(window.scrollX, s)
                : (t.scrollTop = s);
        }),
        (o = function (t) {
            return 'function' != typeof requestAnimationFrame
                ? setTimeout(t, 16)
                : requestAnimationFrame(t);
        }),
        (n = function (t) {
            'function' != typeof requestAnimationFrame ? clearTimeout(t) : cancelAnimationFrame(t);
        }),
        (t.SimpleScrollTo = class {
            constructor(t) {
                s.add(this),
                    (this.target = void 0),
                    (this.isX = !1),
                    (this.start = 0),
                    (this.end = 0),
                    (this.distance = 0),
                    (this.duration = 3e3),
                    (this.animation = void 0),
                    (this.taskNumber = void 0),
                    (this.callback = void 0),
                    (this.target = t.target),
                    (this.isX = t.isX),
                    (this.start = t.start),
                    (this.end = t.end),
                    (this.duration = t.duration),
                    (this.callback = t.callback),
                    (this.animation = t.animation || ((t) => t)),
                    this.scrollTo();
            }
            scrollTo() {
                this.cancel();
                const t = this.duration,
                    n = this.end - this.start,
                    a = Date.now(),
                    r = () => {
                        this.taskNumber = i(this, s, 'm', o).call(this, () => {
                            const o = Date.now();
                            if (o < a) return;
                            const c = Math.min((o - a) / t, 1),
                                l = n * this.animation(c);
                            (this.distance = l),
                                i(this, s, 'm', e).call(this),
                                1 != c ? r() : this.callback && this.callback();
                        });
                    };
                r();
            }
            cancel() {
                i(this, s, 'm', n).call(this, this.taskNumber);
            }
        });
});
//# sourceMappingURL=simple-json-data.umd.js.map
