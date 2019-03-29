<template>
  <div class="home">
    <el-form
      :model="baseTemplate"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm">
      <div class="layout">
        <div class="title">
          <span>基本设置</span>
          <el-dropdown @command="checkBaseTemplate">
            <el-button type="primary" size="mini">
              选择模版
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="chenzhixiang">陈志祥</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang1">狮子头</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang2">螺蛳粉</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang">双皮奶</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang">蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="success"
            size="mini"
            @click="generateDoc('ruleForm',baseTemplate.apiName)"
          >生成</el-button>
        </div>

        <el-row :gutter="20">
          <el-col class="input" :span="12">
            <el-form-item label="活动名称" prop="apiName">
              <el-input size="mini" v-model="baseTemplate.apiName" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="12">
            <el-form-item label="接口描述" prop="title">
              <el-input size="mini" v-model="baseTemplate.title" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col class="input" :span="12">
            <el-form-item label="负责组长" prop="groupOwner">
              <el-input size="mini" v-model="baseTemplate.groupOwner" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="12">
            <el-form-item label="接口负责" prop="methodOwner">
              <el-input size="mini" v-model="baseTemplate.methodOwner" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col class="input" :span="12">
            <el-form-item label="安全级别" prop="securityLevel">
              <el-radio
                border
                size="mini"
                v-model="baseTemplate.securityLevel"
                label="Anonym"
              >Anonym</el-radio>
              <el-radio border size="mini" v-model="baseTemplate.securityLevel" label="User">User</el-radio>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="12">
            <el-form-item label="接口状态" prop="state">
              <el-input size="mini" v-model="baseTemplate.state" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="layout">
        <div class="title">
          <span>请求参数</span>
          <el-dropdown @command="checkBaseTemplate">
            <el-button type="primary" size="mini">
              选择实体
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="chenzhixiang">陈志祥</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang1">狮子头</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang2">螺蛳粉</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang">双皮奶</el-dropdown-item>
              <el-dropdown-item command="chenzhixiang">蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-row :gutter="10" v-for="(param,index) in params" :key="index">
          <el-col class="input" :span="5">
            <el-form-item label-width="0" prop="paramName">
              <el-input size="mini" v-model="param.paramName" placeholder="参数描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="3">
            <el-form-item label-width="0" prop="paramType">
              <el-select size="mini" v-model="param.paramType" placeholder="参数类型">
                <el-option label="text" value="text"></el-option>
                <el-option label="file" value="file"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="6">
            <el-form-item label-width="0" prop="paramDesc">
              <el-input size="mini" v-model="param.paramDesc" placeholder="参数描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="3">
            <el-form-item label-width="0" prop="paramRequired">
              <el-select size="mini" v-model="param.paramRequired" placeholder="是否必传">
                <el-option label="必传" value="true"></el-option>
                <el-option label="非必传" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="input" :span="7">
            <el-form-item label-width="0">
              <el-button size="mini" type="primary" @click="addParam">添加参数</el-button>
              <el-button size="mini" type="danger" @click="removeParam(index)">删除参数</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import docStr from "@/assets/docTemplate/base";
import fs from "fs";
import { resolve } from "path";
export default {
  name: "home",
  data() {
    const verApiName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入接口名称"));
      }
      if (!/^node_([a-z]+\.[a-z]+)$/gi.test(value)) {
        return callback(new Error("接口名格式错误"));
      }
      callback();
    };
    return {
      apiLevel: "1",
      baseTemplate: {},
      params: [
        {
          paramName: "",
          paramType: "text",
          paramDesc: "",
          paramRequired: "true"
        }
      ],
      rules: {
        apiName: [{ validator: verApiName, trigger: "change" }],
        title: [
          { required: true, message: "请输入接口描述", trigger: "change" }
        ],
        groupOwner: [
          { required: true, message: "请输入负责组长", trigger: "change" }
        ],
        methodOwner: [
          { required: true, message: "请输入接口负责", trigger: "change" }
        ],
        securityLevel: [
          { required: true, message: "请选择安全等级", trigger: "change" }
        ],
        state: [
          { required: true, message: "请输入接口状态", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    checkBaseTemplate(command) {
      const filePath = resolve(
        __dirname,
        `../assets/baseTemplate/${command}.json`
      );
      fs.readFile(filePath, (err, data) => {
        this.baseTemplate = JSON.parse(data);
      });
    },
    generateDoc(formName, name) {
      // console.log(this.filterParams(this.params))

      // return
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (name) {
            const _name = name.split(".");
            const group = _name[0].split("_")[1];
            const filename = resolve(
              __dirname,
              `../assets/apiDoc/${_name[1]}.js`
            );
            fs.writeFile(
              filename,
              docStr(this.baseTemplate, this.filterParams(this.params)),
              err => {
                if (err) {
                  this.$message.error("创建新文件失败");
                } else {
                  this.$message({
                    showClose: true,
                    message: "创建新文件成功",
                    type: "success"
                  });
                }
              }
            );
          } else {
            this.$message.error("请输入接口名称");
          }
        } else {
          return false;
        }
      });
    },

    // 添加参数
    addParam() {
      this.params.push({
        paramName: "",
        paramType: "text",
        paramDesc: "",
        paramRequired: "true"
      });
    },
    // 删除参数
    removeParam(index) {
      this.params.splice(index, 1);
    },
    // 筛选掉非法的param
    filterParams(params) {
      if (params && params.length) {
        params = params.filter(item => {
          return item.paramName !== "" && item.paramDesc !== "";
        });
      }
      return params;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 30px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: #fff;
  .el-form-item,
  .el-select {
    width: 100%;
  }
  .el-radio {
    margin-right: 10px;
  }
  .title {
    margin-bottom: 20px;
    padding-bottom: 10px;
    font-size: 22px;
    border-bottom: 1px solid #409eff;
    display: flex;
    align-items: center;
    & > span {
      margin-right: 20px;
    }
  }
}
</style>


