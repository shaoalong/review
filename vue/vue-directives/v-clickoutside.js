export default {
    bind(el, binding) {
        function documentHandler(e) {
            if (el.contains(el.target)) {
                return false;
            }
            if (binding.expession) {
                binding.value(e)
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler)
    },
    unbind(el) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
}