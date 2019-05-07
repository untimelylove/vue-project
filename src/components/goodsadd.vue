<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" class="card-box">
      <el-steps :active="active-1" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- el-tabs 是一个大表单 所以外面可以嵌套一个el-form-->
      <el-form :model="formGoodsAdd" label-width="80px" :rules="addFormRules">
        <el-tabs
          :tab-position="tabPosition"
          v-model="active"
          :before-leave="beforeTab"
          @tab-click="handleClick"
        >
          <!-- //? 这里的v-model接收的是el-tab-pane里name的值，双向绑定——表单元素 -->
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="formGoodsAdd.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="formGoodsAdd.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="formGoodsAdd.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="formGoodsAdd.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- //?  :options 作用是获取到列表的信息
              //? ：props 作用是显示列表里的哪些属性
              //? ：v-model作用是把选中的id值同步到data成员中
              -->
              <el-cascader
                expand-trigger="hover"
                :options="catList"
                v-model="seleOption"
                :props="catProps"
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in manyParams" :key="i">
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2,j) in item1.attr_vals" :key="j"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,i) in onlyParams"
              :key="i"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <!-- 富文本 -->
            <quill-editor v-model="formGoodsAdd.goods_introduce"></quill-editor>

            <!-- 按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  created() {
    this.getCatList()
  },
  methods: {
    // 已上传文件的钩子
    handlePreview(file) {},
    handleRemove(file) {
      // 图片的临时路径
      const tmp_path = file.response.data.tmp_path
      // 从pics数组中移除元素
      // ?这里遇到一个问题就是如何移除指定的图片，就需要找到对应的下标进行操作
      // ?那么怎么找图片数组对象的下标呢，用findindex
      const index = this.formGoodsAdd.pics.findindex((item, i) => {
        // ?在这里判断数组里面的图片路径是否跟当前移除的是否一致 将会返回一个下标
        return item.pic === tem_path
      })
      this.formGoodsAdd.pics.splice(index, 1)
    },
    handleSuccess(response) {
      // 上传成功时保存的临时路径 将来会用
      const tmp_path = response.data.tmp_path
      // 因为在提交表单的时候会提交整个表单数据，也要提交图片的路径
      // 上传成功以后会产生临时路径，要把这个临时路径保存进请求参数formGoodsAdd.pics里面
      this.formGoodsAdd.pics.push({
        pic: tmp_path
      })
    },
    async addGoods() {
      // 1. 准备请求体数据formGoodsAdd
      // goods_cat 商品分类 -> 选中的id所在的数组->字符串
      this.formGoodsAdd.goods_cat = this.seleOption.join(',')

      // pics: '',商品图片 -> [{pic:临时路径}] pic是数组要的是对象 这个在上传成功以后操作，上传成功后会生成临时路径
      // attrs: '' 商品参数 -> [{attr_id:?,attr_value:?}]
      this.manyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          this.formGoodsAdd.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          })
        }
      })
      this.onlyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          this.formGoodsAdd.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        }
      })
      // console.log(this.formGoodsAdd.attrs)
      // 发送请求post -> 请求体

      // 2. 发送post请求 -> 请求体
      const { data } = await this.$http.post(`goods`, this.formGoodsAdd)
      if (data.meta.status !== 201) {
        // 提示
        return this.$message({
          message: data.meta.msg,
          type: 'error',
          duration: 1500
        })
      }
      this.$message.success(data.meta.msg)
      // 回到列表->改变页面的内容->改变组件->1.router-link 2.js编程式导航
      this.$router.push('/goods')
    },
    // 到了新的tabs要显示静态数据 哪里发生请求合适呢? 点击tabs生效后请求，tabs有自身的点击事件
    async handleClick() {
      // 获取动态参数数据
      if (this.active === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }
        // 处理动态参数数组中的attr_vals
        res.data.forEach((item, i) => {
          item.attr_vals = item.attr_vals.split(',')
          // console.log(item.attr_vals)
        })
        this.manyParams = res.data
      }
      // console.log(this.manyParams)
      if (this.active === '3') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }
        this.onlyParams = res.data
      }
    },
    //?  点击tags选中之前的时候发生的回调处理
    beforeTab(active, oldactive) {
      // 做判断进行处理 原先的name是不是1 选中的数组长度是不是3
      if (oldactive === '1' && this.seleOption.length !== 3) {
        // 提示框:提示选择三级分类
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    // 获取选项改变的值 把第三极的id赋值给data成员以后要使用
    catChange() {
      this.threeCatId = this.seleOption[2]
      // console.log(this.threeCatId)
    },
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得好的分类数据赋予给catThreeList
      this.catList = dt.data
    }
  },
  data() {
    return {
      addFormRules: {
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        goods_name: {
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        },
        goods_price: {
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        },
        goods_weight: {
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        },
        goods_number: {
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        },
        goods_cat: {
          required: true,
          message: '请选取商品分类',
          trigger: 'blur'
        }
      },
      // 动态参数数据
      manyParams: [],
      // 静态参数数据
      onlyParams: [],
      // 存储第三极的id值
      threeCatId: [],
      //props绑定的属性值 级联三级分类项目参数，有这个对象级联才会显示内容
      catProps: {
        value: 'cat_id',
        label: 'cat_name'
      },
      //v-model绑定的属性值 获取选中的 catProps——> value: 'cat_id' 值 他是存储被选中的id值是一个数组
      seleOption: [],
      // 级联的相关数据
      catList: [],
      // el-step和el-tabs通过active联动，建立关系
      active: '1',
      tabPosition: 'left',
      /*
         goods_name     	商品名称                    	不能为空
         goods_price    	价格                      	不能为空
         goods_weight   	重量                      	不能为空
         goods_number   	数量                      	不能为空
         goods_cat      	以为','分割的分类列表            	不能为空

         goods_introduce	介绍                      	可以为空
         pics           	上传的图片临时路径（对象）           	可以为空
         attrs          	商品的参数（数组），包含 动态参数 和 静态属性	可以为空

      */
      formGoodsAdd: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',

        goods_cat: '',
        pics: [],
        attrs: []
      }
    }
  }
}
</script>

<style>
.el-tabs {
  margin-top: 30px;
}
.ql-editor,
.ql-blank {
  min-height: 200px;
}
</style>
