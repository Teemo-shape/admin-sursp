<template>
  <div class="login-container">
    <div class="login-form">
    <el-row :gutter="20">
      <el-col :lg="6" :sm="10" class="aa">
          <h3>后台管理系统</h3>
          <el-form
            :model="ruleForm2"
            status-icon
            :rules="rules2"
            ref="ruleForm2"
            label-width="100px"
            class="login-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm2.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
    </div>
  </div>
</template>
<script>
import { login } from "@/api/api.js";
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        password: "admin",
        username: "admin"
      },
      rules2: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  created(){
      this.$store.commit('closeMask')
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.$store.commit('saveLoginStatus',true)
            this.$router.push({
                path: "/"
              });
        //   login(this.ruleForm2)
        //     .then(res => {
        //       this.$router.push({
        //         path: "/"
        //       });
        //     })
        //     .catch(err => {
        //       this.$message("error", err.message);
        //     });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss">
.login-container {
  background: url('../../assets/images/login-bg.e2134055.jpg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: fixed;
  display: table;
  .login-form {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    color: white;
    font-size: 18px;
    .aa{
        margin: auto;
        float: none;
        // position: absolute;
        // left: 50%;
        // top: 50%;
        width: 350px;
        padding: 20px 0 30px 0;
        // transform: translate(-50%,-50%);
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        // overflow: hidden;
    }
    h3{
      line-height: 60px;
      margin-left: 20px
    }
  }
}
.el-form-item__label{
    color: #fff;
}
</style>

