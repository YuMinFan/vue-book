<!--  -->
<template>
  <div class="detail">
    <MHeader :back="true">详情</MHeader>
    <ul>
      <li>
        <label for="bookName">书的名称</label>
        <input type="text" v-model="book.bookName" id="bookName">
      </li>
      <li>
        <label for="bookInfo">书的信息</label>
        <input type="text" v-model="book.bookInfo" id="bookInfo">
      </li>
      <li>
        <label for="bookPrice">书的价格</label>
        <input type="text" v-model.number="book.bookPrice" id="bookPrice">
      </li>
      <li>
        <button @click="update">确认修改</button>
      </li>
    </ul>
  </div>
</template>

<script>
import {findOneBook,updateBook} from '../api';
import MHeader from '../base/MHeader.vue';
export default {
  components:{
    MHeader
  },
  watch:{
    $route(){ 
      this.getData();
    }
  },
  created(){
    this.getData();
  },
  data () {
    return {
      book: {}
    };
  },
  computed: {
    bid(){
      return this.$route.params.bid;
    }
  },
  methods: {
    async getData(){
      this.book = await findOneBook(this.bid);
      //  如果是空对象 跳转回列表页
      Object.keys(this.book).length > 0 ? void 0 : this.$router.push('/list');
    },
    async update(){
      await updateBook(this.bid,this.book);
      this.$router.push('/list');
    }
  }
}

</script>
<style scoped lang="less">
ul{
  margin: 50px 20px 0 20px;
  li{
    label{
      display: block;
      font-size: 25px;
    }
    input{
      margin: 10px 0;
      height: 25px;
      width: 100%;
    }
  }
}
.detail{
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
button{
  display: block;
  width: 60px;
  height: 25px;
  background: rgb(46, 114, 190);
  color: #fff;
  border: none;
  border-radius: 4px;
  outline: none;
}
</style>