export default {
    name: 'tableRender',
    functional: true,
    props: {
        row: Object,
        index: Number,
        render: Function,
    },
    data: {},
    children: [],
    render: (h, ctx) => {
        const params = {
            row: ctx.props.row,
            index: ctx.props.index
        };
        return ctx.props.render(h, params);
    }
};