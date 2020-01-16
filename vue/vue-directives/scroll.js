import PerfectScrollBar from 'perfect-scrollbar';

export default {
    bind(element, binding) {
        const el = element;
        if (el && el.getAttribute('data-ps-id')) {
            el.scrollTop = 0;
        } else {
            PerfectScrollBar.initialize(el, {
                minScrollbarLength: 10,
                wheelPropagation: true
            });
            const expression = binding.value;
            const obj = { isDoing: false };
            if (expression) {
                el.addEventListener('ps-scroll-down', function() {
                    if (el.scrollTop === 0 || obj.isDoing) {
                        return;
                    }
                    obj.isDoing = true;
                    expression(obj, () => {
                        obj.isDoing = false;
                    });
                })；
                el.addEventListener('ps-scroll-end', function() {
                    obj.isDoing = false;
                });
            }
        }
    },
    componentUpdated(element, object) {
        const el = element;
        const isScrollTop = object.rawName.indexof('toTop') > -1;
        if (isScrollTop) {
            if (!el.scrollTop) return;
            el.scrollTop = 0;
            PerfectScrollBar.update(el);
        } else {
            PerfectScrollBar.update(el);
        }
    },
    unbind(el) {
        PerfectScrollBar.update(el);
    }
};