<template>
  <div>
    <com-crub keyword="商品"></com-crub>
    <el-button type="primary" @click="showCat()" icon="el-icon-circle-plus-outline" class="addfl">添加分类</el-button>
    <el-dialog
      title="添加分类"
      :visible.sync="addcatVisible"
      @close="resetFields()"
    >
      <!-- //? model跟prop配合使用，modelt通data成员里面的小对象，prop接收里面的数据 
           //? model prop v-model 都有着联系 model是表单数据的对象 
            //? prop	表单域 model 字段，在使用 validate、resetFields 方法的情况下，
           //? 该属性是必填的	string	传入 Form 组件的 model 中的字段
      -->
      <el-form :model="addCat" :rules="catrules" ref="catcatruleForm" label-width="100px">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCat.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类上级">
          <el-cascader
            expand-trigger="hover"
            :options="catTwoList"
            v-model="catTwoListSelect"
            @change="handleChange()"
            :props="catTwoprop"
            change-on-select
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addcatVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcatlist">添 加</el-button>
      </div>
    </el-dialog>
    <el-card class="card-box">
      <el-table style="width: 100%" border stripe :data="catList" row-key="cat_id">
        <!-- //?  prop  对应列内容的字段名，也可以使用 property 属性  -->
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              size="small"
              @click="edituser(info.row.id)"
            >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="del(info.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import loginVue from './login.vue';
export default {
  created() {
    this.getCatList()
  },
  methods: {
    // 重置表单
    resetFields() {
      // 分类名称重置
      this.$refs.catcatruleForm.resetFields()
      // 分类上级重置
      this.catTwoListSelect = []
      // 重置form表单的数据 意思就是重置已经选中或者添加完成以后的数据
      this.addCat.cat_pid   = 0
      this.addCat.cat_level = 0
    },
    // 添加分类
    addcatlist(){
      this.$refs.catcatruleForm.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('categories', this.addCat)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 添加分类成功：提示、关闭对话框、数据刷新
          this.$message.success(dt.meta.msg)
          this.addcatVisible = false
          this.getCatList()
        }
      })
    },
      //  接收到级联选择器改变的属性值 获取到级联选组器选中的id，为请求需要的参数做准备
    handleChange() {
        var len = this.catTwoListSelect.length
        console.log(this.catTwoListSelect)  // 打印出的是选中的数据的id
        if(len === 0){
            // 没有选择上级分类的情况下添加
            this.addCat.cat_pid = 0
            this.addCat.cat_level = 0
        }else{
            // 等级：如果长度为1意思就是只选一个上级 他的长度就是1 那么添加的这个字段就是2级
            // 级数的规则：0是一级 1是二级 所以长度跟等级是相等的
            this.addCat.cat_level = len
            // 如果有选取上级就获取到上级的id 有选择第一级或者第二级，所以要对长度相减得出下标
            // 相减得出来的下标就指向的是新添加分类的下标
            this.addCat.cat_pid = this.catTwoListSelect[len-1]
        }
    },
    async showCat() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (dt.meta.status !== 200) {
        return this, $message.error(dt.meta.msg)
      }
      this.catTwoList = dt.data
      this.addcatVisible = true
    },
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.querycdt
      })
      console.log(dt)

      if (dt.meta.status !== 200) {
        return this, $message.error(dt.meta.msg)
      }
      this.catList = dt.data.result
    }
  },
  data() {
    return {
      // 表单数据对象 这个是提交添加分类需要的参数
      addCat: {
        cat_name: '',
        cat_level:'',
        cat_pid:''
      },
      // 用于接收分类列表的信息
      catTwoList: [],
      // 接收选中的分类信息
      catTwoListSelect: [],
      // 添加分类框
      addcatVisible: false,
      // 级联选择器需要显示的项目
      catTwoprop: {
        label: 'cat_name', // 定义显示字段
        value: 'cat_id', // 起作用的字段
        children: 'children' // 父子关系数据连接字段
      },
      // 用来接收显示列表的信息
      catList: [],
      catrules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 分类需要的参数类名 当做请求参数小对象
      querycdt: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .addfl{
    margin-top: 15px;
  }
</style>
