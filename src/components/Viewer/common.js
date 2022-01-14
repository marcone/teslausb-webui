
export const SEGMENT_DURATION = 60;

export const positions = ['front', 'back', 'left_repeater', 'right_repeater'];
export const primaryPos = positions[0];

export function once(el, event, fn) {
    el.addEventListener(event, function handler(e) {
        el.removeEventListener(event, handler);
        fn(e);
    });
}
