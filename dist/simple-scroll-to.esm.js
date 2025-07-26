/*!
 * simple-json-data v0.0.1
 * Copyright 2025 wuzhanggui https://github.com/wurencaideli
 * Licensed under MIT
 */
function t(t, i, s, a) {
    if ('a' === s && !a) throw new TypeError('Private accessor was defined without a getter');
    if ('function' == typeof i ? t !== i || !a : !i.has(t))
        throw new TypeError(
            'Cannot read private member from an object whose class did not declare it',
        );
    return 'm' === s ? a : 'a' === s ? a.call(t) : a ? a.value : i.get(t);
}
var i, s, a, e;
'function' == typeof SuppressedError && SuppressedError;
class n {
    constructor(t) {
        i.add(this),
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
        const e = this.duration,
            n = this.end - this.start,
            o = Date.now(),
            r = () => {
                this.taskNumber = t(this, i, 'm', a).call(this, () => {
                    const a = Date.now();
                    if (a < o) return;
                    const c = Math.min((a - o) / e, 1),
                        h = n * this.animation(c);
                    (this.distance = h),
                        t(this, i, 'm', s).call(this),
                        1 != c ? r() : this.callback && this.callback();
                });
            };
        r();
    }
    cancel() {
        t(this, i, 'm', e).call(this, this.taskNumber);
    }
}
(i = new WeakSet()),
    (s = function () {
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
    (a = function (t) {
        return 'function' != typeof requestAnimationFrame
            ? setTimeout(t, 16)
            : requestAnimationFrame(t);
    }),
    (e = function (t) {
        'function' != typeof requestAnimationFrame ? clearTimeout(t) : cancelAnimationFrame(t);
    });
export { n as SimpleScrollTo };
//# sourceMappingURL=simple-json-data.esm.js.map
