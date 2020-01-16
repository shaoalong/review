import Vue from 'vue';
const DialogConstructor = Vue.extend(require('./dialogue').default);

const dialog = ({
    type = 'alert',
    content = 'hello~',
    sureCallback = () => {},
    cancelCallbak = () => {},
    sureTxt = '确定',
    cancelTxt = '取消',
} = {}) => {
    const DialogInstance = new DialogConstructor({ data: { type, content, sureCallback, cancelCallbak, sureTxt, cancelTxt } });
    DialogInstance.vm = DialogInstance.$mount();
    DialogInstance.dom = DialogInstance.vm.$el;
    document.body.appendChild(DialogInstance.dom);
};

export default {
    install: (param) => {
        const vue = param;
        vue.prototype.$dialog = {
            alert({ content, callback }) {
                dialog({
                    type: 'alert',
                    content,
                    sureCallback: callback
                });
            },
            confirm({ content, sureCallback, cancelCallbak, sureTxt, cancelTxt}) {
                dialog({
                    type: 'confirm',
                    content,
                    sureCallback,
                    cancelCallbak,
                    sureTxt,
                    cancelTxt
                });
            },
        };
    }
};