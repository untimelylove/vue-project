<template>
  <div>
    <com-crub keyword="权限"></com-crub>
    <el-card shadow="always" class="card-box">
      <el-table style="width: 100%" border stripe :data="rightsList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
        // ? 用作用域插槽  来循环判断显示等级
          <template slot-scope="info">
            <el-tag v-if="info.row.level ==0">一级</el-tag>
            <el-tag v-else-if="info.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    created() {
        this.getRigthsList()
    },
    methods: {
        async getRigthsList() {
            const { data: dt } = await this.$http.get('rights/list')
            console.log(dt)
            if (dt.meta.status !== 200) {
                this.$message.error(dt.meta.msg)
            }
            this.rightsList = dt.data
        }
    },
    data() {
        return {
            rightsList: []
        }
    }
}
</script>

<style lang="less" scoped>
</style>
