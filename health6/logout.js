// 简单退出登录处理
function logoutUser(){localStorage.clear();const a=document.getElementById("loginButtons"),b=document.getElementById("userArea");a&&(a.style.display="flex"),b&&(b.style.display="none"),window.location.href="index.html"}window.logoutUser=logoutUser;
