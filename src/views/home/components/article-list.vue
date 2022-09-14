<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [], //存储列表数据数组
      loading: false, //控制加载中loading状态
      finished: false, //控制数据加载结束状态
      timestamp: null, //请求获取下一页数据的时间戳
      error: false, //控制列表加载失败的提示状态
      isreFreshLoading: false, //控制下拉刷新的loading
      refreshSuccessText: '刷新成功', //下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或者滚动到底部的时候会触发onLoad()
    async onLoad() {
      try {
        // 1 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道ID
          //   timestamp简单理解就是请求数据的页码
          //   请求第一页数据：当前最新时间戳
          //   用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1, //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 2 把请求结果数据放到list数组中
        const { results } = data.data
        // ...数组的展开操作符，它会把数组元素一个一个拿出来
        this.list.push(...results)
        // 3 本次数据加载结束之后要把 加载状态 设置为 结束
        this.loading = false

        // 4 判断数据全部加载完成
        if (results.length) {
          // 更新获取下一页的数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为 true ，不再 load 加载更多了
          this.finished = true
        }
      } catch (err) {
        // 展示错误信息
        this.error = true
        // 请求失败了，loading 也需要关闭
        this.loading = false
      }
    },
    // onLoad() {
    //   //   console.log('onLoad')
    //   // 1 请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     // 2 吧把请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3 本次数据加载结束之后要把 加载状态 设置为 结束
    //     // loading 关闭之后才能触发下一次的加载更多
    //     this.loading = false

    //     // 4 判断数据全部加载完成
    //     if (this.list.length >= 40) {
    //       // 如果没有数据了，把finished 设置为 true ，之后不再触发加载更多
    //       this.finished = true
    //     }
    //   }, 1000)
    // },

    // 当下拉刷新的时候会触发该函数
    async onRefresh() {
      // console.log('onRefresh')

      try {
        // 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道ID
          timestamp: Date.now(), //下拉刷新每次请求获取最新数据。所以传递当前最新时间戳
          with_top: 1, //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.refreshSuccessText = '刷新失败'
        // 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false
      }
    },
  },
}
</script>
<style lang="less" scoped>
.article-list {
  // 百分比单位是相对于父元素的
  height: 79vh;
  overflow-y: auto;
}
</style>
