<template>
    
</template>
<script>
export default {
    data() {
        return {
            type: 'alert',
            content: '',
            sureCallback: () => {},
            cancelCallback: () => {},
            sureTxt: '确定',
            cancelTxt: '取消',
            autoClose: true,
            destroyStatus: false
        }
    },
    mounted() {
        if (this.type === 'alert' && this.autoClose) {
            this.sure();
        }
    },
    methods: {
        sure() {
            this.sureCallback();
            this.destroy();
        },
        cancel() {
            this.cancelCallback();
            this.destroy();
        },
        close() {
            if (this.type === 'alert') {
                this.sure();
            } else {
                this.cancel();
            }
        },
        destroy(interval) {
            setTimeout(() => {
                this.$destroy(true);
                if (!this.destroyStatus) {
                    this.destroyStatus = true;
                    this.$el.parentNode.removeChild(this.$el);
                }
            }, interval || 500);
        }
    }
}
</script>
