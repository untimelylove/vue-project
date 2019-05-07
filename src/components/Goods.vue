<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
        <el-table-column label="创建时间" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.add_time|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [], // 商品列表数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 删除商品
    async delGoods(goodsId) {
      const cfm = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete('goods/' + goodsId)

        if (res.meta.status !== 200) {
          return this.$message({
            message: '删除商品失败！',
            type: 'error',
            duration: 1000
          })
        }

        // 刷新
        this.getGoodsList()
        // 提示
        this.$message({
          message: '删除商品成功！',
          type: 'success',
          duration: 1000
        })
      }
    },

    // 跳转到添加商品页面
    goAddPage() {
      console.log(this)
      this.$router.push('goodsadd')
    },
    // 根据关键字检索数据
    search() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },

    // 分页页码信息变化回调
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },

    // 分页每页条数变化回调
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },

    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message({
          message: '获得商品列表失败！',
          type: 'error',
          duration: 1000
        })
      }
      // console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top:15px;
}
</style>
