<!--  -->
<template>
  <div>
      <MHeader>列表页</MHeader>
      <div class="content" ref="scroll" @scroll="loadMore">
        <ul>
          <router-link v-for="(book,key) in books" :key="key" :to="{name: 'detail',params: {bid:book.bookId}}" tag="li">
            <img v-lazy="book.bookCover" alt="">
            <div>
              <h4>{{book.bookName}}</h4>
              <p>{{book.bookInfo}}</p>
              <b>{{book.bookPrice}}</b>
              <div class="btn-list">
                <button @click.stop="remove(book.bookId)">删除</button>
                <button @click.stop>收藏</button>
              </div>
            </div>
          </router-link>
        </ul>
        <div class="more">加载更多</div>
      </div>
  </div>
</template>

<script>
import { pagination, removeBook } from "../api";
import MHeader from "../base/MHeader.vue";
export default {
  created() {
    this.getData();
  },
  mounted() {
    let scroll = this.$refs.scroll;
    let top = scroll.offsetTop;
    let distance = 0;
    let isMove = false;
    scroll.addEventListener(
      "touchstart",
      e => {
        if (scroll.scrollTop != 0 || scroll.offsetTop != top) return;
        let start = e.touches[0].pageY; //手指点击的开始
        let move = e => {
          isMove = true;
          let current = e.touches[0].pageY;
          distance = current - start;
          if (distance > 0) {
            if (distance <= 50) {
              scroll.style.top = distance + top + "px";
            } else {
              distance = 50;
              scroll.style.top = 50 + top + "px";
            }
          } else {
            scroll.removeEventListener("touchmove", move);
            scroll.removeEventListener("touchend", end);
          }
        };
        let end = e => {
          if(!isMove) return;
          isMove = false;
          clearInterval(this.timer1);
          this.timer1 = setInterval(() => {
            if (distance <= 0) {
              console.log(1);
              clearInterval(this.timer1);
              distance = 0;
              scroll.style.top = top + "px";
              scroll.addEventListener("touchmove", move);
              scroll.addEventListener("touchend", end);
              this.books = [];
              this.offset = 0;
              this.hasMore = false;
              this.getData();
              return;
            }
            distance -= 1;
            scroll.style.top = distance + top + "px";
          }, 1);
        };
        scroll.addEventListener("touchmove", move);
        scroll.addEventListener("touchend", end);
      },
      false
    );
  },
  components: {
    MHeader
  },
  data() {
    return {
      books: [],
      offset: 0,
      hasMore: true,
      isLoading: false
    };
  },
  methods: {
    loadMore() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let { scrollTop, clientHeight, scrollHeight } = this.$refs.scroll;
        if (scrollTop + clientHeight + 20 > scrollHeight) {
          this.getData();
        }
      }, 60);
    },
    async remove(id) {
      console.log(id);
      await removeBook(id);
      this.books = this.books.filter(item => item.bookId !== id);
    },
    async getData() {
      if (this.hasMore && !this.isLoading) {
        this.isLoading = true;
        let { hasMore, books } = await pagination(this.offset);
        this.books = [...this.books, ...books];
        this.hasMore = hasMore;
        this.isLoading = false;
        this.offset = this.books.length;
      }
    }
  }
};
</script>
<style scoped lang="less">
.content {
  h4 {
    font-size: 20px;
    line-height: 35px;
  }
  p {
    color: #2a2a2a;
    line-height: 25px;
  }
  b {
    color: red;
  }
  button {
    display: block;
    width: 60px;
    height: 25px;
    background: rgb(207, 23, 23);
    color: #fff;
    border: none;
    border-radius: 15px;
    outline: none;
  }
  ul {
    padding: 10px;
    li {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      img {
        width: 130px;
        height: 150px;
      }
    }
  }
}
.more {
  margin: 10px;
  background: rgb(101, 139, 209);
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
}
.btn-list {
  display: flex;
  justify-content: space-around;
}
</style>