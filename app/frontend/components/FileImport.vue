<template>
  <div class="field">
    <div class="file is-primary">
      <label class="file-label">
        <!-- vue/html-self-closing と prettier/prettier が衝突してしまうので回避している -->
        <!-- eslint-disable prettier/prettier -->
        <input class="file-input" type="file" name="resume" @change="uploadFile" >
        <!-- eslint-enable prettier/prettier -->
        <span class="file-cta">
          <span class="file-icon"> <i class="fas fa-upload" /> </span>
          <span class="file-label"> <strong> インポート </strong> </span>
        </span>
      </label>
    </div>
    <Processing v-if="isProcessing" />
  </div>
</template>

<script>
import RssParser from 'rss-parser';

import {importBookmarkListApi} from '../api';

import Processing from './Processing.vue';

export default {
  components: {
    Processing,
  },
  data() {
    return {
      isProcessing: false,
    };
  },
  methods: {
    uploadFile(e) {
      this.isProcessing = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.parseRss(reader.result);
      };
      reader.readAsText(e.target.files[0]);
    },

    async parseRss(rssData) {
      const parser = new RssParser({
        customFields: {
          item: [
            ['dc:subject', 'tags', {keepArray: true}],
            ['link', 'url'],
            ['description', 'comment'],
          ],
        },
      });
      try {
        const res = await parser.parseString(rssData);
        await this.insertBookmarkList(
          res.items.map(i => ({
            date: i.date,
            title: i.title,
            url: i.url,
            tags: i.tags,
            comment: i.comment,
          }))
        );
      } catch (e) {
        this.showDialog(
          'ファイルの読み込みに失敗しました。\n対応しているのは RSS1.0 形式のファイルのみです。'
        );
        this.isProcessing = false;
      }
    },

    async insertBookmarkList(bookmarkList) {
      try {
        await importBookmarkListApi(bookmarkList);
        this.showDialog('ブックマークのインポートに成功しました。');
        window.location.href = window.location.href;
      } catch (e) {
        this.showDialog(e.message);
        this.isProcessing = false;
      }
    },

    showDialog(message) {
      // TODO: アラートではなくモーダルダイアログを使う
      alert(message);
    },
  },
};
</script>
