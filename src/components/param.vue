<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" class="card-box">
      <el-alert title="注意：只允许为第三极分类设置相关参数！" type="warning" center show-icon></el-alert>
      <el-row class="rowtop">
        <el-col>
          选择商品分类：
          <!-- options 接收到三级分类的信息 props 显示三级信息-->
          <el-cascader
            expand-trigger="hover"
            :options="catThreeList"
            v-model="catThreeSelected"
            :props="catThreeProps"
            @change="catThreeChange()"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsClick()">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>
          <el-table :data="manyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="200">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>
          <el-table :data="onlyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="200">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getThreeList()
  },
  methods: {
      // tabs切换满足选取的是第三极，获取参数列表数据  获取到以后就改变了初始值那么久获取列表
      tabsClick(){
          if(this.catThreeId !== 0){
              this.getParamList()
          }
      },
    // 根据分类类型和静态/动态获取对应的数据列表
    async getParamList() {
      const { data: dt } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      // 把参数可选值 由"字符串"变为"数组"格式另创建成员(attr_vals_arr)存储
      dt.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    },
    // 三级内容改变的回调处理
    catThreeChange() {
      var len = this.catThreeSelected.length
      if (len !== 3) {
        // 没有选取第三级别，禁用按钮，并且清除
        this.catThreeSelected = [], // 重置级联选择器数据
        this.catThreeId = 0 // 收回catThreeId
        // 收回获得好的"参数列表"数据
        this.manyParamList = []
        this.onlyParamList = []
        this.showButton = true
      } else {
        this.showButton = false
        this.catThreeId = this.catThreeSelected[2]
        this.getParamList()
      }
    },
    async getThreeList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得好的分类数据赋予给catThreeList
      this.catThreeList = dt.data
    }
  },
  data() {
    return {
      // 选中第三级别的id 从级联选择器change事件中获取
      catThreeId: [],
      // 动态成员
      manyParamList: [],
      // 静态成员
      onlyParamList: [],
      // 按钮禁用激活状态
      showButton: true,
      // 当前激活的项目
      activeName: 'many',
      // 接收三级分类信息
      catThreeList: [],
      // 接收级联选择器中选中的信息
      catThreeSelected: [],
      // 级联选择器属性定义 要显示的数据
      catThreeProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rowtop {
  margin-top: 15px;
}
.el-tag{
  margin:10px 5px;
}
</style>
