<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_img">
        <img src="../assets/img2.png" />
      </div>
      <el-form
        label-width="0px"
        class="form_box"
        :model="LoginForm"
        :rules="LoginFormRules"
        ref="LoginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-yonghu"
            placeholder="请输入账号"
            v-model="LoginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            placeholder="请输入密码"
            v-model="LoginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary">注册</el-button>
          <el-button type="success" @click="Login()">登录</el-button>
          <el-button type="info" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      LoginForm: {
        username: "",
        password: "",
      },
      //先制定rules，然后对象放入，最后在prop中将规则绑定
      LoginFormRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //resetFields方法要获取表单的实例对象才能使用，实例对象通过ref引用进行获取,LoginFormRef
    resetForm() {
      // console.log(this)
      this.$refs.LoginFormRef.resetFields();
    },
    Login() {
      this.$refs.LoginFormRef.validate(async (vaild) => {
        if (!vaild) return; //如果取到到false，就直接return
        const { data: res } = await this.$http.post("login", this.LoginForm); //通过axios的post请求发送数据,该结果是permisses，所以要用async进行简化
        console.log(res);
        if (res.code !== 0) return this.$message.error("错误");
        this.$message.success("成功");
        sessionStorage.setItem("token", res.data.token);
        this.$router.push("/Index");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login_container {
  background-color: gray;
  height: 100%;
}
.login_box {
  height: 400px;
  width: 550px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .login_img {
    height: 200px;
    width: 200px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
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
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
