<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/user.jpg" alt>
      </div>
      <el-form ref="loginRules" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <i slot="prefix" class="iconfont icon-user"></i>            
          </el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" show-password>
            <i slot="prefix" class="iconfont icon-3702mima"></i> 
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="6">
            <el-button type="warning" round @click="login()">登录</el-button>
            <el-button type="primary" round @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
    }
  },
  methods: {
    login() {
      this.$refs.loginRules.validate(async valid => {
        console.log(this)
        if(valid === true){
          const {data:dt} = await this.$http.post('/login',this.loginForm)
          console.log(dt)
          if(dt.meta.status !== 200){
            return this.$notify.error(dt.meta.msg);
          }else{
            //? 管理员账号登录成功，把返回来的token保存在客户端
            window.sessionStorage.setItem('token',dt.data.token)
            this.$message(dt.meta.msg);
            this.$router.push('/home');
          }
        }
      })
    },
    resetForm(){
      this.$refs.loginRules.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: rgba(30, 136, 150, 0.3);
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: rgba(0,0,0,.3);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #logo-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 50px;
      box-sizing: border-box;
    }
  }
}
</style>
