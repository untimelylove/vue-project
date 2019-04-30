<template>
  <div>
    <com-crub keyword="权限"></com-crub>
    <el-card shadow="always" class="card-box">
      <el-row>
        <el-col :span="18">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="dialogFormVisible = true"
          >添加用户</el-button>
          <el-dialog
            title="添加用户"
            :visible.sync="dialogFormVisible"
            @close="$refs.addruleForm.resetFields()"
          >
            <el-form
              :model="addForm"
              :rules="addrules"
              ref="addruleForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" type="password" show-password></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="adduserForm">添 加</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="6">
          <!-- // ? 模糊查询，通过双向绑定传值给下面组件query,组件完成查询 -->
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            size="mediuml"
            v-model="querycdt.query"
            clearable
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table style="width: 100%" border sripe :data="userList">
        <!-- //?  prop  对应列内容的字段名，也可以使用 property 属性  -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- {{mg_state===true?'显示':'不显示'}} // ? 这个方法行不通 -->
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            inactive-color="#ff4949"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              circle
              size="small"
              @click="edituser(info.row.id)"
            ></el-button>
            <el-dialog
              title="修改用户"
              :visible.sync="editFormVisible"
              @close="$refs.editruleForm.resetFields()"
            >
              <el-form
                :model="editForm"
                :rules="editrules"
                ref="editruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="edituserForm()">确 定</el-button>
              </div>
            </el-dialog>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="del(info.row.id)"
            ></el-button>
            <el-dialog
              title="分配角色"
              :visible.sync="disFormVisible"
              @close="$refs.disruleForm.resetFields()"
            >
              <el-form :model="setRole" :rules="disrules" ref="disruleForm" label-width="100px">
                <el-form-item label="当前用户" prop="username">{{setRole.username}}</el-form-item>
                <el-form-item label="当前角色" prop="role_name">{{setRole.role_name}}</el-form-item>
                <el-form-item label="授权新角色" prop="rid">
                  <el-select v-model="setRole.rid" placeholder="请选择">
                    <el-option
                      v-for="item in roleList"
                      :label="item.roleName"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="disFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="disuserForm()">确 定</el-button>
              </div>
            </el-dialog>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="small"
                @click="disRoleForm(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
          :page-sizes="[4, 6, 8, 12]"
          :page-size="querycdt.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import loginVue from './login.vue'
export default {
  created() {
    this.getUserList()
  },
  data() {
    var validateMobile = (rule, value, callback) => {
      var reg = /^1[356789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    return {
      // 用来接收角色列表的名称
      roleList: [],
      // 分配角色弹框
      disFormVisible: false,
      // 分配角色相关代码 这里面的参数名字必须和api返回的名字一模一样
      setRole: {
        username: '', // 当前角色的用户名
        role_name: '', // 当前角色的角色名称
        rid: 0 // 选中角色的id用此接收
      },
      // 选取角色的规则
      disrules: {
        rid: [{ required: true, message: '角色必填', trigger: 'change' }]
      },
      editrules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      addrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormVisible: false,
      dialogFormVisible: false,
      userList: [],
      total: 0,
      querycdt: {
        query: '', // 模糊搜索关键字
        pagenum: 1, // 当前显示的页码
        pagesize: 4 // 每页显示数据条数
      }
    }
  },
  methods: {
    //修改用户的状态 开关形式，不需要刷新页面
    async changeState(user, state) {
      const { data: dt } = await this.$http.put(`users/${user}/state/${state}`)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    // 分配角色
    async disRoleForm(user) {
      // 触发事件获取角色信息
      const { data: dt } = await this.$http.get('roles')
      // console.log(dt)

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.roleList = dt.data
      // 把整个角色信息赋值给表单数据 用于显示当前的角色信息
      this.setRole = user
      // console.log(this.disForm = role)
      this.disFormVisible = true
    },
    // 提交修改的角色
    disuserForm() {
      this.$refs.disruleForm.validate(async valid => {
        if (valid === true) {
          // ? 用户的id 选中角色的ID 为什么这儿能直接获取到用户ID呢 因为点分配角色按钮的时候就已经把角色整个信息全传过来了，直接用就行
          const { data: dt } = await this.$http.put(
            `users/${this.setRole.id}/role`,
            { rid: this.setRole.rid }
          )
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.disFormVisible = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    // ? 根据id获取到对应的数据
    edituserForm() {
      this.$refs.editruleForm.validate(async valid => {
        if (valid === true) {
          // ? 这的修改请求参数要求发送id,虽然edituser没有id的
          // ? 参数，但是api返回来的数据里面有id，可以直接使用
          const { data: dt } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.editFormVisible = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    async edituser(id) {
      this.editFormVisible = true
      const { data: dt } = await this.$http.get('users/' + id)
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.editForm = dt.data
    },
    // ? 收集表单数据提交修改的数据
    del(id) {
      this.$confirm('确定要删除该用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('users/' + id)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          if (this.userList.length == 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.$message.success(dt.meta.msg)
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    adduserForm() {
      // ? 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
      // ? 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.addruleForm.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post('users', this.addForm)
          console.log(dt)
          if (dt.meta.status !== 201) {
            this.$message.error('添加失败')
          }
          this.dialogFormVisible = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    handleSizeChange(val) {
      // ? val 是变化后的每页显示的条数
      // ? 把显示的条数赋值给请求的参数 querycdt
      // ? 变化后的条数重新获取数据展示数据 重新请求
      this.querycdt.pagesize = val
      this.getUserList()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // ? 把变化后的页码赋值给请求的参数 querycdt
      // ? 重新请求列表数据，展示数据
      this.querycdt.pagenum = val
      this.getUserList()
      console.log(`当前页: ${val}`)
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.userList = dt.data.users
      this.total = dt.data.total
      // console.log(this.userList)
    }
    // ? 重置是通过ref获取到这个元素，清除里面表单的东西，在表单注册close事件
    // addresetForm() {
    //     this.$refs.addruleForm.resetFields()
    // }
  }
}
</script>

<style lang="less" scoped>
.el-tooltip {
  margin-left: 0;
}
</style>
