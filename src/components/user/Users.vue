<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <!-- gutter 为栅格间距 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- table -->
    <el-table :data="userlist" style="width: 100%" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="mobile" label="联系方式"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="suerStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="removeUserById(scope.row.id)"
          ></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"
            @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 弹窗主体 -->
      <el-form :model="addFrom" :rules="addFormRules" ref="addFromRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 弹窗主体 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色弹窗 -->
    <!-- 权限弹窗 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed"> 
      <div>

        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select 
          v-model="seletedRoleId"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >

            </el-option>
          </el-select>

        </p>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };

    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示数据数量
        pagesize: 5
      },
      userlist: [],
      total: 0,
      //控制添加弹窗显示隐藏
      addDialogVisible: false,
      //添加用户的表单
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户表单的规则对象
      addFormRules: {
        username: [
          {
            required: true,
            messgae: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "请用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            messgae: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "请用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            messgae: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            messgae: "请输入手机号码",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },

      //控制修改弹窗 显示隐藏
      editDialogVisible: false,
      //查询到的用户信息
      editForm: {},
      //修改弹窗 验证规则
      editFormRules: {
        email: [
          {
            required: true,
            messgae: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            messgae: "请输入手机号码",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },

      //分配角色弹窗 控制显示
      setRoleDialogVisible:false,
      //需要分配的 用户角色
      userInfo:{},

      //下拉角色
      rolesList:[],
      //选中的角色
      seletedRoleId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //删除
    async removeUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error) //只有一行箭头函数 简写

        console.log(confirmResult);
        //用户确认 返回 文本 confirm
        if(confirmResult != "confirm"){
          return this.$message.info("已取消删除")
        }

        const {data:res} = await this.$http.delete(`users/${id}`)
        if(res.meta.status != 200){
          return this.$message.error("删除失败")
        }

        this.$message.success("删除成功")
        this.getUserList()
},
    //修改用户信息
    editUserInfo() {
      //预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //通过验证发起请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );

        if(res.meta.status != 200){
          return this.$message.error("更新用户信息失败")
        }
        this.$message.success("更新用户信息成功")
        //关闭弹窗
        this.editDialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    //监听编辑用户弹窗重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //展示用户编辑弹窗
    async showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      //根据id查询用户信息
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status != 200) {
        return this.messgae.error("查询用户信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    //添加新用户按钮
    addUser() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return;
        //校验通过时请求
        const { data: res } = await this.$http.post("users", this.addFrom);

        if (res.meta.status != 201) {
          return this.message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //隐藏弹窗
        this.addDialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    //关闭 添加用户弹窗
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
    },

    // 更新状态
    async suerStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新抓过你太成功！");
    },
    //监听pagesize事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    //监听 页码 事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },

    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },


    async setRole(userInfo){

      this.userInfo = userInfo
      
      // 获取角色列表
      const {data:res} = await this.$http.get("roles")

      if (res.meta.status != 200){
        return this.$message.error("角色列表获取失败")
      }

      this.rolesList = res.data;

      this.setRoleDialogVisible = true;
    },
    //分配角色  确认按钮
    async saveRoleInfo(){
      if(!this.seletedRoleId){
        return this.$message.error("请选择角色")
      }

      const { data:res } = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.seletedRoleId
      })

      if(res.meta.status != 200 ){
        return this.$messgae.error("分配角色失败")
      }

      this.$message.success("分配角色成功")

      this.getUserList()

      this.setRoleDialogVisible = false;
    },

    setRoleDialogClosed(){
      this.seletedRoleId = ''
      this.userInfo = {}
    }

  }
};
</script>

<style lang="less" scoped>
</style>