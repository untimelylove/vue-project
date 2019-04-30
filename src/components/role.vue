<template>
  <div>
    <com-crub keyword="角色"></com-crub>
    <el-dialog title="分配权限" :visible.sync="roleVisible" @close="$refs.roleruleForm.resetFields()">
      <el-form :model="roleForm" ref="roleruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="当前角色:">{{ roleForm.roleName }}</el-form-item>
        <el-form-item label="角色描述:">{{ roleForm.roleDesc }}</el-form-item>
        <el-form-item label="分配权限">
          <!-- node-key="id" 的的作用是将当前的唯一字段名给予复选框被选中 作用就跟下拉列表必须给value值一样，就可以读取到input值一样-->
          <el-tree
            :data="rights"
            :props="treeProps"
            node-key="id"
            show-checkbox
            default-expand-all
            :default-checked-keys="rightsChecked"
            ref="treeRef"
             @close="$refs.treeRef.resetFields()"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addroleForm">添 加</el-button>
      </div>
    </el-dialog>
    <el-card shadow="always" class="card-box">
      <el-table style="width: 100%" border sripe :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="props">
            <!--  //? 这里循环的是一级 权限名字 -->
            <el-row
              v-for="(info,l) in props.row.son"
              :key="info.id"
              :style="{'border-bottom':'1px solid #ccc',
            'border-top':l === 0? '1px solid #ccc':''}"
            >
            <!-- //? 都加下边框，排序为0的加上边框 -->
              <el-col :span="5">
                <el-tag
                  type="danger"
                  closable
                  @close="rightsClose(props.row,info.id)"
                >{{ info.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- // ?这里循环的是二级 权限名字 循环的是一级里面的子权限 -->
              <el-col :span="19">
                <!-- //? 为什么要用row来嵌套两个列呢？ 因为三个子权限要从第二个里面读取到 info2.children 所以嵌套就可以拿到数据 排列顺序不为0的都有上边框-->
                <el-row
                  v-for="(info2,ll) in info.children"
                  :key="info2.id"
                  :style="{'border-top':ll !== 0? '1px solid #ccc':''}"
                >
                  <!-- //? 排序不为0的都加上边框  -->
                  <el-col :span="6">
                    <!-- //? 这里的props.row传过去的是当前的角色权限信息，里面有id,权限描述。角色 -->
                    <el-tag closable @close="rightsClose(props.row,info2.id)">{{ info2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="info3 in info2.children"
                      :key="info3.id"
                      closable
                      @close="rightsClose(props.row,info3.id)"
                    >{{ info3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作">
          // ? 用作用域插槽 来循环判断显示等级
          <template slot-scope="info">
            <el-button type="success" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showrole(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  data() {
    return {
      // 用来装载默认选中的第三级别权限id
      rightsChecked: [],
      roleList: [],
      roleVisible: false,
      roleForm: {
        // ? ↓ 这个属性可以省略不写，因为点击事件触发以后传送过去的是整个角色的信息包括id,roleName,roleDesc,son
        // ? 在分配权限的方法里面已经把整个角色的信息设置给了roleForm所以他就具备了整个信息，写上是因为代码得可读性
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      // ? 权限列表展示
      rights: [],
      // ?大树里面数据之间的联系，必须有的属性 children是用来联系父跟子之间的字段名 label是显示名字的字段名
      // ?返回来的数据恰好是用children来连接的，所以名字一致 -->
      treeProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 分配权限
    async addroleForm() {
      // 全选节点
      var arr1 = this.$refs.treeRef.getCheckedKeys()
      // 半选节点
      var arr2 = this.$refs.treeRef.getHalfCheckedKeys()
      // console.log(arr1,arr2) 
      // api请求路径需要的参数是字符串，所以拼接成字符串，用哪个逗号隔开 
      var arrnum = arr1.concat(arr2).join(',')
      console.log(arrnum)
      // 角色的id和被全选和半选的(1,2,3)权限id
      const {data:dt} = await this.$http.post(`roles/${this.roleForm.id}/rights`, {
        rids: arrnum
      })
      console.log(dt)
      
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.roleVisible = false
      this.$message.success(dt.meta.msg)
      this.getRoleList()
    },
    async showrole(role) {
      const { data: dt } = await this.$http.get('rights/tree')
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rights = dt.data
      var threeId = [] // 存放第三级别id
      // role：从里面获取第三级字段名id值
      // threeId：存在获取到的值
      this.getThreeId(role, threeId)
      // 把拥有权限的id值赋值给rightsChecked数组
      this.rightsChecked = threeId
      this.roleVisible = true
      this.roleForm = role
    },
    // 通过遍历递归的方式，一层挖一层的获取到第三级的id
    // 参数 setnode:给setnode的第一维设置children字段
    //      arr: 存放获取到的权限id
    getThreeId(setnode, arr) {
      if (setnode.son) {
        setnode.children = setnode.son
      }
      if (!setnode.children) {
        return arr.push(setnode.id)
      }
      setnode.children.forEach(item => {
        this.getThreeId(item, arr)
      })
    },
    rightsClose(rights, roleid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(
            'roles/' + rights.id + '/rights/' + roleid
          )
          // console.log(dt)

          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          // this.getRoleList() // ? 这种对用户体验不好，会自动收起
          // 我们上面的参数直接传过来的是当前角色的权限信息，直接更新当前角色的信息就实现了局部更新
          rights.son = dt.data
        })
        .catch(() => {})
    },
    // 获取全部角色权限信息列表
    async getRoleList() {
      const { data: dt } = await this.$http.get('roles')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // ?element为遍历出来的小对象
      dt.data.forEach(element => {
        // ? 把里面的children的数据全部赋值给son
        element.son = element.children
        // ? 此时son和children是共存的，所以删掉children
        delete element.children
      })
      this.roleList = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
