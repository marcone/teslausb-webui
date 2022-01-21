import Vue from 'vue';
import {fromPairs} from 'lodash';
import {positions} from '@/common';

function log(...args) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
}

class EventEmitter {
    events = {};

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (!this.events[event]) {
            return;
        }
        const index = this.events[event].indexOf(callback);
        if (index > -1) {
            this.events[event].splice(index, 1);
        }
    }

    once(event, callback) {
        const once = (...args) => {
            callback(...args);
            this.off(event, once);
        }
        this.on(event, once);
    }

    fire(event, ...args) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach(callback => callback(...args));
    }

    clear() {
        this.events = {};
    }
}

class VideoController extends EventEmitter {

    constructor({key, src}) {
        super();

        const el = document.createElement('video');
        el.muted = true;
        el.preload = 'none';
        el.src = src;
        el.playsInline = true;
        this.el = el;

        this.key = key;
    }

    set playbackRate(rate) {
        this.el.playbackRate = rate;
    }
    set currentTime(time) {
        this.el.currentTime = time;
    }

    _updateBuffered() {
        const emit = () => {
            const buffered = this.el.buffered.length > 0 ? this.el.buffered.end(0) : 0;
            this.fire('buffered', buffered);
            return isNaN(this.el.duration) ? 0 : buffered / this.el.duration;
        };

        this.el.addEventListener('progress', emit);

        const intervalTrigger = () => {
            const p = emit();
            if (p < 1) {
                setTimeout(intervalTrigger, 200);
            }
        };
        intervalTrigger(); // in case progress event is not fired as soon as expected
    }

    _waitForEnoughData() {
        // TODO: use buffered time to determine if enough data is loaded
        // the higher the playback rate is, the more buffered data is required
        return waitUntil(() => {
            return this.el.readyState >= 4; // HAVE_ENOUGH_DATA
        }, 100);
    }

    async _handleWaitting() {
        if (this._isWaiting) { // waiting event is fired continuously
            return;
        }
        log('waiting', this.key);
        this._isWaiting = true;
        this.fire('waiting');
        await this._waitForEnoughData();
        this._isWaiting = false;
        log('resume', this.key);
        this.fire('resume');
    }

    _retry = 0;
    _handleError() {
        const err = this.el.error || {};
        log('error', this.key, err);
        if (err.code === 2 && this._retry++ < 3) { // MEDIA_ERR_NETWORK -> retry
            this._isWaiting = false;
            this._handleWaitting();
            return;
        }
        if (this.container) {
            this.container.dataset.error = err.message || 'Unknown error';
        }
        this.fire('error');
    }

    load() {
        log('load', this.key);
        this._updateBuffered();
        this.el.addEventListener('waiting', this._handleWaitting.bind(this));
        this.el.addEventListener('timeupdate', e => this.fire('timeupdate', e.target.currentTime));
        this.el.addEventListener('playing', () => this.fire('playing'));
        this.el.addEventListener('pause', () => this.fire('pause'));
        this.el.addEventListener('ended', () => this.fire('ended'));
        this.el.addEventListener('error', this._handleError.bind(this));
        this.el.load();
    }

    async play() {
        log('play wait start', this.key);
        await this._waitForEnoughData();
        log('play wait end', this.key);
        const promise = oncePromise(this.el, 'playing');
        this.el.play();
        return promise;
    }

    pause() {
        this.el.pause();
    }

    attach(container) {
        container.dataset.error = '';
        container.appendChild(this.el);
        if (this.el.error) {
            container.dataset.error = this.el.error.message;
        }
        this.container = container;
    }

    detach() {
        this.container.innerHTML = '';
        this.container = undefined;
    }

    destroy() {
        log('destroy', this.key);
        this.clear();
        this.detach();
        this.el.src = null;
    }
}


export default class MultipleVideoController extends EventEmitter {

    // make states reactive
    store = new Vue({
        data: {
            isLoading: false,
            buffereds: fromPairs(positions.map(pos => [pos, 0])),
            waitings: fromPairs(positions.map(pos => [pos, false])),

            currentTime: 0
        },
        computed: {
            isBuffering() {
                return Object.values(this.waitings).some(v => v);
            },
            buffered() {
                return Math.min(...Object.values(this.buffereds));
            }
        },
        watch: {
            isBuffering(isBuffering) {
                if (isBuffering) {
                    this.controller.pause();
                }
                else {
                    this.controller._play();
                }
            }
        }
    });

    get isWaiting() {
        return this.store.isLoading || this.store.isBuffering;
    }
    get currentTime() {
        return this.store.currentTime;
    }
    get buffered() {
        return this.store.buffered;
    }

    set playbackRate(rate) {
        this._callControllers(controller => {
            controller.playbackRate = rate;
        });
    }
    set currentTime(time) {
        this._callControllers(controller => {
            controller.currentTime = time;
        });
    }

    constructor(videos, autoload) {
        super();
        this.store.controller = this;

        this.controllers = fromPairs(Object.entries(videos).map(([key, video]) => {
            const instance = new VideoController(video);
            instance.on('waiting', this._handleWaitting.bind(this, key));
            instance.on('buffered', this._handleBuffered.bind(this, key));
            return [key, instance];
        }));

        Object.values(this.controllers)[0].on('timeupdate', this._handleTimeUpdate.bind(this));

        Promise.all(Object.values(this.controllers).map(controller => new Promise(resolve => {
            controller.once('error', resolve);
            controller.once('ended', resolve);
        }))).then(() => this.fire('ended'));

        if (autoload) {
            this.load();
        }
    }

    _callControllers(action) {
        const promises = Object.entries(this.controllers).map(([key, controller]) => action(controller, key));
        return Promise.all(promises);
    }

    _handleWaitting(key) {
        this.store.waitings[key] = true;
        this.controllers[key].once('resume', () => {
            this.store.waitings[key] = false;
        });
    }

    _handleBuffered(key, val) {
        this.store.buffereds[key] = val;
        this.fire('buffered', val);
    }

    _handleTimeUpdate(t) {
        this.store.currentTime = t;
    }

    load() {
        if (this._loaded) {
            return;
        }
        this._callControllers(controller => controller.load());
        this._loaded = true;
    }

    async play() {
        this.store.isLoading = true;
        await this._play();
        this.store.isLoading = false;
    }

    _play() {
        this._callControllers(controller => controller.play());
    }

    pause() {
        this._callControllers(controller => controller.pause());
    }

    attach(containers) {
        this._callControllers((controller, key) => controller.attach(containers[key]));
    }

    destroy() {
        this._callControllers(controller => controller.destroy());
    }
}

function once(el, event, callback) {
    const once = (...args) => {
        el.removeEventListener(event, once);
        callback(...args);
    }
    el.addEventListener(event, once);
}

function oncePromise(el, event) {
    return new Promise(resolve => once(el, event, resolve));
}

async function waitUntil(check, interval) {
    while (!check()) {
        await delay(interval);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
