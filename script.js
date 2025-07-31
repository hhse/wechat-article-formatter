// 全局变量
let currentStyle = 'default';
let currentSettings = {
    fontSize: '16',
    lineHeight: '1.6',
    paragraphSpacing: '15',
    textAlign: 'center'
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 设置默认样式
    selectStyle('default');
    
    // 绑定编辑器事件
    const editor = document.getElementById('editor');
    editor.addEventListener('input', updatePreview);
    editor.addEventListener('keyup', updatePreview);
    
    // 初始化预览
    updatePreview();
    
    // 绑定设置事件
    updateSettings();
    
    // 添加编辑器快捷键
    addEditorShortcuts();
}

// 更新预览内容
function updatePreview() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    
    if (editor && preview) {
        let content = editor.innerHTML;
        
        // 处理特殊格式
        content = processContent(content);
        
        // 应用当前样式和设置
        preview.innerHTML = content;
        applyStyleToPreview();
        applySettingsToPreview();
    }
}

// 处理内容格式
function processContent(content) {
    // 处理图片
    content = content.replace(/<img([^>]*)>/g, function(match, attrs) {
        return `<img${attrs} style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;">`;
    });
    
    // 处理引用块
    content = content.replace(/<blockquote([^>]*)>/g, function(match, attrs) {
        return `<blockquote${attrs} style="border-left: 4px solid #667eea; padding-left: 20px; margin: 20px 0; font-style: italic; background: rgba(102, 126, 234, 0.1); padding: 15px; border-radius: 0 8px 8px 0;">`;
    });
    
    // 处理列表
    content = content.replace(/<ul([^>]*)>/g, function(match, attrs) {
        return `<ul${attrs} style="padding-left: 20px; margin: 15px 0;">`;
    });
    
    content = content.replace(/<ol([^>]*)>/g, function(match, attrs) {
        return `<ol${attrs} style="padding-left: 20px; margin: 15px 0;">`;
    });
    
    // 处理标题
    content = content.replace(/<h([1-6])([^>]*)>/g, function(match, level, attrs) {
        const sizes = {1: '2rem', 2: '1.5rem', 3: '1.3rem', 4: '1.1rem', 5: '1rem', 6: '0.9rem'};
        return `<h${level}${attrs} style="font-size: ${sizes[level]}; margin: 20px 0 10px 0; font-weight: 600;">`;
    });
    
    // 处理段落
    content = content.replace(/<p([^>]*)>/g, function(match, attrs) {
        return `<p${attrs} style="margin: 10px 0;">`;
    });
    
    return content;
}

// 选择样式
function selectStyle(style) {
    currentStyle = style;
    
    // 更新样式卡片状态
    document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const selectedCard = document.querySelector(`[data-style="${style}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // 应用样式到预览
    applyStyleToPreview();
    
    // 显示选择反馈
    showNotification(`已选择${getStyleName(style)}风格`);
}

// 获取样式名称
function getStyleName(style) {
    const styleNames = {
        'default': '默认',
        'elegant': '优雅',
        'modern': '现代',
        'classic': '经典',
        'colorful': '多彩',
        'minimal': '极简'
    };
    return styleNames[style] || style;
}

// 应用样式到预览
function applyStyleToPreview() {
    const preview = document.getElementById('preview');
    if (!preview) return;
    
    // 移除所有主题类
    preview.classList.remove('default-theme', 'elegant-theme', 'modern-theme', 'classic-theme', 'colorful-theme', 'minimal-theme');
    
    // 添加当前主题类
    preview.classList.add(`${currentStyle}-theme`);
}

// 应用设置到预览
function applySettingsToPreview() {
    const preview = document.getElementById('preview');
    if (!preview) return;
    
    const settings = getCurrentSettings();
    
    preview.style.fontSize = `${settings.fontSize}px`;
    preview.style.lineHeight = settings.lineHeight;
    preview.style.textAlign = settings.textAlign;
    
    // 设置段落间距
    const paragraphs = preview.querySelectorAll('p');
    paragraphs.forEach(p => {
        p.style.marginBottom = `${settings.paragraphSpacing}px`;
    });
}

// 获取当前设置
function getCurrentSettings() {
    return {
        fontSize: document.getElementById('fontSize').value,
        lineHeight: document.getElementById('lineHeight').value,
        paragraphSpacing: document.getElementById('paragraphSpacing').value,
        textAlign: document.getElementById('textAlign').value
    };
}

// 更新设置
function updateSettings() {
    currentSettings = getCurrentSettings();
    applySettingsToPreview();
}

// 文本格式化功能
function formatText(command) {
    const editor = document.getElementById('editor');
    
    if (editor) {
        document.execCommand(command, false, null);
        editor.focus();
        updatePreview();
    }
}

// 插入图片
function insertImage() {
    const url = prompt('请输入图片URL：');
    if (url) {
        const editor = document.getElementById('editor');
        const img = `<img src="${url}" alt="图片" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;">`;
        
        if (editor) {
            document.execCommand('insertHTML', false, img);
            editor.focus();
            updatePreview();
        }
    }
}

// 插入引用
function insertQuote() {
    const editor = document.getElementById('editor');
    const quote = `<blockquote style="border-left: 4px solid #667eea; padding-left: 20px; margin: 20px 0; font-style: italic; background: rgba(102, 126, 234, 0.1); padding: 15px; border-radius: 0 8px 8px 0;"><p>在这里输入引用内容...</p></blockquote>`;
    
    if (editor) {
        document.execCommand('insertHTML', false, quote);
        editor.focus();
        updatePreview();
    }
}

// 切换预览模式
function togglePreview() {
    const previewContainer = document.querySelector('.preview-container');
    const previewContent = document.getElementById('preview');
    
    if (previewContent.style.maxWidth === '400px') {
        previewContent.style.maxWidth = '100%';
        previewContent.style.margin = '0';
        showNotification('已切换到全屏预览模式');
    } else {
        previewContent.style.maxWidth = '400px';
        previewContent.style.margin = '0 auto';
        showNotification('已切换到手机预览模式');
    }
}

// 导出内容
function exportContent() {
    const preview = document.getElementById('preview');
    const editor = document.getElementById('editor');
    
    if (!preview || !editor) return;
    
    // 创建导出选项
    const exportType = prompt('请选择导出类型：\n1. HTML代码\n2. 纯文本\n3. 复制到剪贴板');
    
    let content = '';
    
    switch(exportType) {
        case '1':
            content = preview.innerHTML;
            downloadFile(content, 'article.html', 'text/html');
            break;
        case '2':
            content = editor.innerText;
            downloadFile(content, 'article.txt', 'text/plain');
            break;
        case '3':
            content = preview.innerHTML;
            copyToClipboard(content);
            break;
        default:
            showNotification('导出已取消');
            return;
    }
    
    showNotification('导出成功！');
}

// 下载文件
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('内容已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 备用复制方法
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('内容已复制到剪贴板');
    } catch (err) {
        console.error('复制失败:', err);
        showNotification('复制失败，请手动复制');
    }
    
    document.body.removeChild(textArea);
}

// 添加编辑器快捷键
function addEditorShortcuts() {
    const editor = document.getElementById('editor');
    
    if (editor) {
        editor.addEventListener('keydown', function(e) {
            // Ctrl+B: 加粗
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                formatText('bold');
            }
            // Ctrl+I: 斜体
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                formatText('italic');
            }
            // Ctrl+U: 下划线
            else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                formatText('underline');
            }
        });
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-size: 14px;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 清空编辑器
function clearEditor() {
    const editor = document.getElementById('editor');
    if (editor) {
        editor.innerHTML = '';
        updatePreview();
        showNotification('编辑器已清空');
    }
}

// 保存到本地存储
function saveToLocalStorage() {
    const editor = document.getElementById('editor');
    if (editor) {
        const content = editor.innerHTML;
        const data = {
            content: content,
            style: currentStyle,
            settings: currentSettings,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('wechatEditorData', JSON.stringify(data));
        showNotification('内容已自动保存');
    }
}

// 从本地存储加载
function loadFromLocalStorage() {
    const data = localStorage.getItem('wechatEditorData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            const editor = document.getElementById('editor');
            
            if (editor && parsed.content) {
                editor.innerHTML = parsed.content;
                currentStyle = parsed.style || 'default';
                currentSettings = parsed.settings || currentSettings;
                
                // 更新UI
                selectStyle(currentStyle);
                updateSettings();
                updatePreview();
                
                showNotification('已恢复上次编辑的内容');
            }
        } catch (e) {
            console.error('加载保存的数据失败:', e);
        }
    }
}

// 自动保存功能
setInterval(saveToLocalStorage, 30000); // 每30秒自动保存

// 页面加载时恢复数据
window.addEventListener('load', loadFromLocalStorage);

// 页面卸载前保存
window.addEventListener('beforeunload', saveToLocalStorage);

// 添加右键菜单
document.addEventListener('contextmenu', function(e) {
    if (e.target.id === 'editor') {
        e.preventDefault();
        showContextMenu(e);
    }
});

// 显示右键菜单
function showContextMenu(e) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 150px;
    `;
    
    const menuItems = [
        { text: '撤销', action: () => document.execCommand('undo') },
        { text: '重做', action: () => document.execCommand('redo') },
        { text: '剪切', action: () => document.execCommand('cut') },
        { text: '复制', action: () => document.execCommand('copy') },
        { text: '粘贴', action: () => document.execCommand('paste') },
        { text: '全选', action: () => document.execCommand('selectAll') }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        `;
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.backgroundColor = '#f5f5f5';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = 'white';
        });
        menuItem.addEventListener('click', () => {
            item.action();
            document.body.removeChild(menu);
        });
        menu.appendChild(menuItem);
    });
    
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
} 