#!/bin/bash
echo "🔍 检查项目大小..."
du -sh .
echo "文件数量:"
find . -type f | wc -l
