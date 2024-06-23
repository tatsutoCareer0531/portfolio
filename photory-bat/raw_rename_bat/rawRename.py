import os
import sys
from datetime import datetime

"""
  RAW画像リネーム
"""
def rawRename(directory):
  fileList = []
  for fileName in os.listdir(directory):
    # 画像情報設定
    picDatetime = datetime.fromtimestamp(os.stat(directory + '/' + fileName).st_mtime).strftime('%Y/%m/%d %H:%M:%S')
    fileList.append({
      'fileName': str(fileName),
      'picDatetime': picDatetime,
    })

  # 更新日時(撮影日時)でソート(昇順)
  fileList = sorted(fileList, key=lambda k: k['picDatetime'])

  i = 1
  for file in fileList:
    # リネーム
    newFileName = 'DSC_' + str(i).zfill(6) + '.' + file['fileName'].split(".")[1]
    os.rename(directory + '/' + file['fileName'], directory + '/' + newFileName)
    i += 1

try:
  print('処理開始')
  rawRename(sys.argv[1])
except Exception as e:
  print(e)
finally:
  print('処理終了')
