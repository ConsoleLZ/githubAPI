import { defineComponent, reactive, toRefs } from 'vue'
import { ActionTypeEnum, ActionTypeMap } from '@/utils/constants.js'
import { message } from 'ant-design-vue'
import axios from 'axios'
import VditorComp from '@/components/vditor-comp/index.vue'

export default defineComponent({
    components: {
        VditorComp
    },
    setup() {
        const state = reactive({
            visible: false,
            text: null,
            actionType: null,
            title: null,
            isConfirmLoading: false,
            isLoading: false
        })

        const postData = {
            file: null,
            config: null,
            filePath: null
        }

        const methods = {
            open(config, actionType, file) {
                state.visible = true
                state.isLoading = true
                postData.file = file
                postData.config = config
                postData.filePath = file.key
                state.actionType = actionType
                state.title = ActionTypeMap.find(item => item.key === actionType).value
                methods.getFileContent().then(data => {
                    state.text = data
                }).finally(() => {
                    state.isLoading = false
                })
            },
            async handleOk() {
                state.isConfirmLoading = true
                methods.updateFile(postData.file.sha, state.text).then(() => {
                    state.visible = false
                }).finally(() => {
                    state.isConfirmLoading = false
                })

            },
            // 获取文件内容
            async getFileContent() {
                const url = `https://api.github.com/repos/${postData.config.owner}/${postData.config.repo}/contents/${postData.filePath}`;
                const headers = { Authorization: `token ${postData.config.accessToken}` };

                try {
                    const response = await fetch(url, { headers });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const content = atob(data.content); // 解码Base64编码的内容

                    // 使用TextDecoder确保解码为UTF-8
                    const decoder = new TextDecoder('utf-8');
                    const uint8Array = new Uint8Array(new ArrayBuffer(content.length));
                    for (let i = 0; i < content.length; i++) {
                        uint8Array[i] = content.charCodeAt(i);
                    }
                    const decodedContent = decoder.decode(uint8Array);

                    return decodedContent;
                } catch (error) {
                    message.error('数据获取失败')
                }
            },
            // 定义utf8ToBase64函数
            utf8ToBase64(str) {
                const encoder = new TextEncoder();
                const encoded = encoder.encode(str);
                return btoa(String.fromCharCode.apply(null, encoded));
            },
            // 更新文件
            async updateFile(sha, newContent) {
                try {
                    const base64Content = methods.utf8ToBase64(newContent); // 使用utf8ToBase64进行Base64编码
                    const response = await axios.put(`https://api.github.com/repos/${postData.config.owner}/${postData.config.repo}/contents/${postData.filePath}`, {
                        message: 'update',
                        content: base64Content,
                        sha: sha,
                        branch: 'main'
                    }, {
                        headers: {
                            Authorization: `token ${postData.config.accessToken}`
                        }
                    });

                    message.success('保存成功')
                } catch (error) {
                    console.log(error)
                    message.error('保存失败')
                }
            }
        }

        return {
            ActionTypeEnum,
            ...toRefs(state),
            ...methods
        }
    }
})
