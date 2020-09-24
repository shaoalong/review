方案一：
    在App.vue声明reload方法，控值router-view的显示隐藏，从而控值页面的再次加载(provide/inject)
    1.data中声明变量 2.绑定v-if 3.方法里写逻辑 4.像后代注入依赖
    <template>
        <div id="app">
            <keep-alive include="cacheComponent">
                <router-view v-if="viewShow"></router-view>
            </keep-alive>
        </div>
    </template>
    <script>
        export defaut {
            provide() {
                return {
                    reload: this.reload
                }
            },
            data() {
                return {
                    viewShow: true
                }
            },
            methods: {
                reload() {
                    this.viewShow = false
                    this.$nextTick(() => {
                        this.viewShow = true
                    })
                }
            }
        }
    </script>
    // 后代组建注入
    inject: ['reload']

    this.reload()

方案二：
        既然当前页面不刷新，就做一个中转页：a -> reload -> a
        // reload.vue:
        created() {
            const route = this.$route.query
            this.$nextTick(() => {
                this.$router.replace({
                    name: route.next,
                    params: route.params,
                    query: route.query
                })
            })
        }