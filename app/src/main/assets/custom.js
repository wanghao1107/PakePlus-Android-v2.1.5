window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ======== 核心修复代码：解决点击链接没反应/白屏/卡死，绝对不能修改 ========
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}
document.addEventListener('click', hookClick)

// ======== 原生通知完整代码：适配你的民宿服务网订单提醒，自动弹窗通知 ========
async function sendNativeNotification(title, content) {
    // 判断是否已授权通知权限
    const isGranted = await window.__TAURI__.notification.isPermissionGranted();
    if (isGranted) {
        // 发送原生安卓通知，适配你的民宿订单场景
        await window.__TAURI__.notification.sendNotification({
            title: title,
            body: content,
            icon: 'https://www.minsuservice.top/favicon.ico', // 用你网站的默认图标，不用改
            channelId: 'minsu_order_notice',
            channelName: '民宿订单通知',
            importance: 'high' // 高优先级，确保通知能弹窗显示，不被系统拦截
        });
    } else {
        // 未授权则自动请求通知权限
        const granted = await window.__TAURI__.notification.requestPermission();
        if (granted) {
            sendNativeNotification(title, content);
        }
    }
}
// 自动监听你的网站订单消息，网页端触发通知时，自动调用原生通知
window.sendNativeNotification = sendNativeNotification;