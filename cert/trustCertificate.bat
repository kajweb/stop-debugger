@echo off
rem https://blog.csdn.net/weixin_37569048/article/details/80846602
rem 注意：：：需要管理员权限，否则运行失败！！
rem 作用：将根证书ca.crt导入当前计算机

rem 导入时windows会弹出警告框（ 缺点），提示用户是否信任该根证书，需要管理员权限
rem win10 有certmgr.exe，但是win 7没有 certmgr.exe
rem certmgr.exe /c /add C:\ca.crt /s root

rem 导入证书到可信任证书颁发者,证书路径需根据实际情况更改
certutil -addstore root ./ca/ca.crt

pause