<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ keyword }}管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ keyword }}列表</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:["keyword"]
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  user-select: none;
}
</style>
