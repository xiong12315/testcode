<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="请填写" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条区域 -->
      <!-- 这里减0是为了将字符串转为数字 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签页区域 -->
      <!-- 商品信息 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateListProp" @change="cateHandleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到后台的API地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addbtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹出框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewimg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  data() {
    return {
      activeIndex: 0,
      // 添加商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //添加商品的表单验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      //商品分类列表
      cateList: [],
      cateListProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: false
      },
      //动态参数列表数据
      manyTabData: [],
      //静态参数列表数据
      onlyTabData: [],
      checkedData: [],
      //图片上传的url
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传的headers
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },

  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取错误');
      }
      // console.log(res);
      this.cateList = res.data;
    },
    //级联选择器变化触发的函数
    cateHandleChange(value) {
      if (value.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName);即将进入的标签名字
      // console.log(oldActiveName);即将离开的标签名字
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请填写分类');
        return false;
      }
    },
    async tabClicked() {
      console.log(this.activeIndex);
      if (this.activeIndex === '1') {
        let { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } });
        if (res.meta.status !== 200) {
          return this.$message.error('错误');
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(',');
        });
        this.manyTabData = res.data;
      } else if (this.activeIndex === '2') {
        let { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } });
        if (res.meta.status !== 200) {
          return this.$message.error('错误');
        }
        this.onlyTabData = res.data;
        // console.log(res.data);
      }
    },
    //处理图片预览效果的事件
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      console.log(this.previewPath);
      this.previewVisible = true;
    },
    //处理移除图片效果的操作
    handleRemove(file) {
      // console.log(file);
      //获取将要删除的图片临时路径
      let findPath = file.response.data.tmp_path;
      //从pics数组中，找到图片对应的索引值
      let index = this.addForm.pics.findIndex(x => x.tmp_path === findPath);
      //用splice方法将图片对象移除
      this.addForm.pics.splice(index, 1);
    },
    //上传成功的时候操作
    handleSuccess(response) {
      console.log(response);
      let picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },
    //按钮控制添加操作
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('填写必要项');
        }
        //执行业务逻辑
        //lodash cloneDeep(obj)深拷贝,使用该方法将原数组的深拷贝进行分割，并且不会影响原数组的v-model
        let form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',');

        //处理manyTabData
        this.manyTabData.forEach(item => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          };
          this.addForm.attrs.push(newInfo);
        });
        //处理onlyTabData
        this.onlyTabData.forEach(item => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        console.log(form);
        let { data: res } = await this.$http.post('goods', form);
        if (res.meta.status !== 201) {
          return this.$message.error('错误');
        }
        this.$message.success('成功');
        this.$router.push('/goods');
      });
    }
  },
  computed: {
    cateId: function() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg {
  width: 100%;
}
.addbtn {
  margin-top: 20px;
}
</style>
