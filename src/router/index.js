import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: "/",
        name: "Index",
        component: () =>
            import ("@/views/Index.vue"),
        children: [{
                path: "/",
                name: "Home",
                component: () =>
                    import ("@/views/Home.vue"),
            },
            {
                path: "/article/:articleId",
                name: 'ArticleDetail',
                component: () =>
                    import ("@/views/ArticleDetail.vue"),
            },
            {
                path: "/sort",
                name: 'Sort',
                component: () =>
                    import ("@/views/Sort.vue"),
            },
            {
                path: "/sort/:sortId",
                name: 'SortDetail',
                component: () =>
                    import ("@/views/SortDetail.vue"),
            },
            {
                path: "/tag",
                name: 'Tag',
                component: () =>
                    import ("@/views/Tag.vue"),
            },
            {
                path: "/tag/:tagId",
                name: 'TagDetail',
                component: () =>
                    import ("@/views/TagDetail.vue"),
            },
        ],
    },
    {
        path: "/login",
        name: 'Login',
        component: () =>
            import ("@/views/login/Index.vue"),
    },
    {
        path: "/admin",
        name: 'AdminIndex',
        component: () =>
            import ("@/views/admin/Index.vue"),
        children: [{
                path: '/admin',
                name: 'AdminHome',
                component: () =>
                    import ('@/views/admin/home/Index.vue')
            },
            {
                path: "/admin/article/add",
                name: 'ArticleAdd',
                component: () =>
                    import ("@/views/admin/article/ArticleEdit.vue"),
            },
            {
                path: "/admin/article/:articleId/edit",
                name: 'ArticleEdit',
                component: () =>
                    import ("@/views/admin/article/ArticleEdit.vue"),
            },
            {
                path: "/admin/article/list",
                name: 'ArticleList',
                component: () =>
                    import ("@/views/admin/article/ArticleList.vue"),
            },
            {
                path: "/admin/article/list/listBySortId/:id",
                name: 'ArticleListBySortId',
                component: () =>
                    import ("@/views/admin/article/ArticleList.vue"),
            },
            {
                path: "/admin/article/list/listByTagId/:id",
                name: 'ArticleListByTagId',
                component: () =>
                    import ("@/views/admin/article/ArticleList.vue"),
            },
            {
                path: "/admin/sort/add",
                name: 'SortAdd',
                component: () =>
                    import ("@/views/admin/sort/SortEdit.vue"),
            },
            {
                path: "/admin/sort/list",
                name: 'SortList',
                component: () =>
                    import ("@/views/admin/sort/SortList.vue"),
            },
            {
                path: "/admin/tag/add",
                name: 'TagAdd',
                component: () =>
                    import ("@/views/admin/tag/TagEdit.vue"),
            },
            {
                path: "/admin/tag/list",
                name: 'TagList',
                component: () =>
                    import ("@/views/admin/tag/TagList.vue"),
            },
            {
                path: "/admin/comment/list/",
                name: 'CommentList',
                component: () =>
                    import ("@/views/admin/comment/CommentList.vue"),
            },
            {
                path: "/admin/comment/list/:type/:id",
                name: 'CommentListByType',
                component: () =>
                    import ("@/views/admin/comment/CommentList.vue"),
            },
            {
                path: "/admin/setting/info",
                name: 'InfoSetting',
                component: () =>
                    import ("@/views/admin/setting/InfoEdit.vue"),
            },
            {
                path: "/admin/setting/safeSetting",
                name: 'SafeSetting',
                component: () =>
                    import ("@/views/admin/setting/SafeSetting.vue"),
            },
            {
                path: "/admin/setting/web",
                name: 'WebSetting',
                component: () =>
                    import ("@/views/admin/setting/WebSetting.vue"),
            },
            {
                path: "/admin/history/list",
                name: 'HistoryList',
                component: () =>
                    import ("@/views/admin/setting/HistoryList.vue"),
            },
        ],
        meta: {
            requireAuth: true
        }
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router