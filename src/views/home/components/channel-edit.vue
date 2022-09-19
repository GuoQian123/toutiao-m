<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 宫格 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          name="clear"
          slot="icon"
          v-show="isEdit && !fixdChannels.includes(channel.id)"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>
<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [], //所有频道
      isEdit: false, //控制编辑状态的显示
      fixdChannels: [0], //固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),

    // 计算属性会观测内部依赖数据的变化
    // 如果依赖数据发生变化，则计算属性会重新执行计算
    recommendChannels() {
      // const channels = []
      // this.allChannels.forEach((channel) => {
      //   // find 遍历数组，找到满足条件的元素值
      //   const ret = this.myChannels.find((myChannel) => {
      //     return myChannel.id === channel.id
      //   })
      //   // 如果我的频道中不包括该频道项，则收集到推荐频道中
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // // 把计算结果返回
      // return channels

      // 这是数组的filter方法
      // 把复符合条件的元素存储到新数组并返回
      return this.allChannels.filter((channel) => {
        // 数组的find方法，遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
      })
    },
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        this.allChannels = res.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },

    // 添加频道
    async onAddChannel(channel) {
      // eslint-disable-next-line vue/no-mutating-props
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, //频道id
            seq: this.myChannels.length, //序号
          })
        } catch (error) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 删除/切换频道
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 编辑状态，执行删除频道

        // 1 如果是固定频道，则不删除
        if (this.fixdChannels.includes(channel.id)) {
          return
        }

        if (index <= this.active) {
          // 2 让激活频道的索引 -1
          this.$emit('update-active', this.active - 1, true)
        }

        // 3 splice(),参数1：要删除的元素的索引
        // 参数2：要删除的元素个数
        // eslint-disable-next-line vue/no-mutating-props
        this.myChannels.splice(index, 1)

        // 4 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，切换频道
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel(channel) {
      if (this.user) {
        // 已登录
        try {
          await deleteUserChannel(channel.id)
        } catch (error) {
          this.$toast('删除失败，请稍后重试')
        }
      } else {
        // 未登录
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;

    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #333333;
        margin-top: 0;
      }

      .active {
        color: red;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
