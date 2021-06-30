<template>
    <div class="login_container">
        <div class="login_box">
            <div class="login_img">
                <img src="../assets/img2.png">
            </div>
            <el-form label-width="0px" class="form_box">
                <el-form-item>
                    <el-input prefix-icon="iconfont icon-yonghu" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input prefix-icon="iconfont icon-mima" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary">注册</el-button>
                    <el-button type="success">登录</el-button>
                    <el-button type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
.login_container{
    background-color:gray;
    height: 100%;
}
.login_box{
    height: 400px;
    width: 550px;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    left:50%;
    top: 50%;
    transform:translate(-50%,-50%);
    .login_img{
        height: 200px;
        width: 200px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color:#fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .form_box{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding:0 20px;
        box-sizing: border-box;
    }
}

</style>