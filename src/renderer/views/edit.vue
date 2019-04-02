<template>
  <div class="edit">
    <el-row :gutter="10">
      <el-col :span="20">
        <el-input size="mini" v-model="docPath" placeholder="请选择文件"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="mini" type="primary" @click="getDocPath">选择doc文件</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-input size="mini" v-model="infoPath" placeholder="请选择文件"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="mini" type="primary" @click="getInfoPath">选择info.json</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { remote } from "electron";
import fs from "fs";
import { createDoc } from "./../assets/utils/parser.js";

export default {
  name: "edit",
  created() {
    createDoc();
    this.docPath = localStorage.getItem("docPath") || "";
    this.infoPath = localStorage.getItem("infoPath") || "";
  },
  data() {
    return {
      docPath: "",
      infoPath: ""
    };
  },
  methods: {
    getDocPath() {
      remote.dialog.showOpenDialog(
        {
          title: "选择apidoc文件",
          properties: ["openFile"],
          filters: [{ name: "apidoc", extensions: ["js"] }]
        },
        filePaths => {
          if (filePaths) {
            this.docPath = filePaths[0];
            localStorage.setItem("docPath", this.docPath);
            this.getApiDoc(this.docPath);
          }
        }
      );
    },
    getInfoPath() {
      remote.dialog.showOpenDialog(
        {
          title: "选择info.json",
          properties: ["openFile"],
          filters: [{ name: "nodedoc", extensions: ["json"] }]
        },
        filePaths => {
          if (filePaths) {
            this.infoPath = filePaths[0];
            localStorage.setItem("infoPath", this.infoPath);
            console.log(this.infoPath);
          }
        }
      );
    },
    getApiDoc(docPath) {
      const docStr = fs.readFileSync(docPath).toString();
      // parse(docStr);

      // console.log("TCL: getApiDoc -> docStr", parse(docStr));
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
  background: #fff;
  .el-row {
    margin-bottom: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
