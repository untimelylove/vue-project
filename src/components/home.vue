<template>
  <el-container>
    <el-aside :style="{width:show?'65px':'200px'}">
      <div>
        <img src="../assets/img/user.jpg" alt>
      </div>
      <div class="fold-logo" @click="show =! show">|||</div>
      <el-col class="left-menu">
        <el-menu
          background-color="#273137"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="show"
          :collapse-transition="false"
        >
          <!-- // ? 人家组件要求index的值是字符串 -->
          <el-submenu
            :index="item.id+''"
            :style="{width:show?'65px':'200px'}"
            v-for="(item,k) in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+icon[k]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group>
              <!-- // ? 这里的 itemS in item.children 是二级嵌套 能够使用一级里面的数据-->
              <el-menu-item
                :index="item.id+'-'+itemS.id"
                v-for="itemS in item.children"
                :key="itemS.id"
              >
                <i class="el-icon-setting"></i>
                {{ itemS.authName }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-aside>
    <el-container>
      <el-header>
        <div class="backstage">
          <img src="../assets/img/backstage.png" alt>
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="outhome()">退出</el-button>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    created() {
        this.getmenulist()
    },
    data() {
        return {
            show: false,
            menulist: [],
            icon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
        }
        // console.log(menulist)
    },
    methods: {
        async getmenulist() {
            const { data: dt } = await this.$http.get('/menus')
            console.log(dt)
            this.menulist = dt.data
        },
        outhome() {
            this.$confirm('确定要退出系统吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    window.sessionStorage.removeItem('token')
                    this.$router.push('/login')
                    // this.$message({
                    //     type: 'success',
                    //     message: '退出成功!'
                    // })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    })
                })
        }
    }
}
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;
    .el-header {
        background-color: #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        .backstage {
            display: flex;
            align-items: center;
            font-size: 20px;
            color: #2f414f;
            font-weight: bold;
            img {
                width: 40px;
                height: 40px;
                padding-right: 20px;
            }
        }
        .el-button--info {
            background-color: #fc5059;
            border: 0;
        }
    }
    .el-aside {
        background-color: #273137;
        img {
            width: 60%;
            height: 60%;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            top: 60px;
            border-radius: 50%;
            user-select: none;
        }
        .fold-logo {
            background-color: #f3f3f3;
            text-align: center;
            color: #273137;
            font-weight: bold;
            font-size: 0.8em;
            margin-top: 80px;
            line-height: 28px;
            letter-spacing: 0.1em;
            cursor: pointer;
            user-select: none;
        }
        .left-menu {
            margin-top: 20px;
        }
    }
}
</style>
