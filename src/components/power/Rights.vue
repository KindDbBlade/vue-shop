<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- table -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="right_name" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-button v-if="scope.row.level == 1" type="pramiry" size="mini">一级</el-button>
            <el-button v-if="scope.row.level == 2" type="warning" size="mini">二级</el-button>
            <el-button v-if="scope.row.level == 3" type="danger" size="mini">三级</el-button>
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      rightsType: "list" //list 数据为list tree 数据为树
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    //监听pagesize事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getRightList();
    },
    //监听 页码 事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getRightList();
    },

    getRightList() {
      this.rightsList = [
        {
          right_name: "1",
          path: "2",
          level: "3"
        },
        {
          right_name: "1",
          path: "2",
          level: "2"
        },
        {
          right_name: "1",
          path: "2",
          level: "1"
        }
      ];
      
    }

    // async getRightList() {
    //   this.rightsList = [
    //     {
    //       right_name: "1",
    //       path: "2",
    //       level: "3"
    //     },
    //     {
    //       right_name: "1",
    //       path: "2",
    //       level: "2"
    //     },
    //     {
    //       right_name: "1",
    //       path: "2",
    //       level: "1"
    //     }
    //   ];

    //   const { data: res } = await this.$http.get(`rights/${this.rightsType}`);

    //   if (res.meta.status != 200) {
    //     return this.$message.error("获取权限列表失败");
    //   }
      
    //   this.rightsList = res.data.rights;
    //   this.total = res.data.total;
      
    // }
  }
};
</script>

<style lang="less" scoped>
</style>