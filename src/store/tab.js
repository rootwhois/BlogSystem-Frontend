export default {
    state: {
        isCollapse: false,
        tabsList: [{
            path: '/admin',
            name: 'AdminHome',
            label: '首页',
            icon: 's-home',
        }],
        breadcrumb: [{
            path: '/admin',
            name: 'AdminHome',
            label: '首页',
            icon: 's-home',
        }],
        currentMenu: null
    },
    mutations: {
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse;
        },
        selectMenu(state, val) {
            if (state.breadcrumb.length > 1) {
                state.breadcrumb.pop();
            }
            if (val.name !== 'AdminHome') {
                state.currentMenu = val;
                const result = state.tabsList.findIndex(item => item.label === val.label);
                if (result === -1) {
                    state.tabsList.push(val);
                } else {
                    if (val.params) {
                        state.tabsList[result].params = val.params;
                    }
                }
                state.breadcrumb.push(val);
            } else {
                state.currentMenu = null;
            }
        },
        changeMenu(state, val) {
            if (state.breadcrumb.length > 1) {
                state.breadcrumb.pop();
            }
            if (val.name !== 'AdminHome') {
                state.breadcrumb.push(val);
            } else {
                state.currentMenu = null;
            }
        },
        closeTag(state, val) {
            const result = state.tabsList.findIndex(item => item.label === val.label);
            if (result !== -1) {
                state.tabsList.splice(result, 1);
            }

            if (state.breadcrumb[state.breadcrumb.length - 1].label === val.label) {
                state.breadcrumb.pop();
            }
        },
        selectBread(state, val) {
            if (state.breadcrumb.length > 1) {
                state.breadcrumb.pop();
            }
        }
    }
}