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

    <div :class="{'is-active': isActiveModal}" class="modal">
      <div class="modal-background" />
      <div class="modal-content">
        <div class="box has-text-centered">
          <div class="section">{{ modalMessage }}</div>
          <div>
            <button class="button is-info" @click="closeModal">OK</button>
          </div>
        </div>
      </div>
    </div>
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
      isActiveModal: false,
      modalMessage: '',
    };
  },
  methods: {
    uploadFile(e) {
      this.isProcessing = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.parseRss(reader.result);
      };
      const file = e.target.files[0];
      if (!file) return; // ファイルアップロードのダイアログでキャンセルした場合の対応
      reader.readAsText(file);
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
        this.showModal(
          'ファイルの読み込みに失敗しました。\n対応しているのは RSS1.0 形式のファイルのみです。'
        );
        this.isProcessing = false;
      }
    },

    async insertBookmarkList(bookmarkList) {
      try {
        await importBookmarkListApi(bookmarkList);
        this.showModal('ブックマークのインポートに成功しました。');
        window.location.href = window.location.href;
      } catch (e) {
        this.showModal(e.message);
        this.isProcessing = false;
      }
    },

    showModal(message) {
      this.modalMessage = message;
      this.isActiveModal = true;
    },

    closeModal() {
      this.modalMessage = '';
      this.isActiveModal = false;
      this.isProcessing = false;
    },
  },
};
</script>

<style scoped>
.modal {
  cursor: default;
}
</style>
