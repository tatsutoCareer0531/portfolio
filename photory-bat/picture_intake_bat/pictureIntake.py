import os
import sys
import json
import shutil
import mysql.connector
from PIL import Image
from datetime import datetime

# JSON
JSON = json.load(open('./../photory_bat.json', 'r'))

# JSON_DB
JSON_DB = JSON['db']

# 画像フォルダパス(保存先)
SAVE_DIRECTORY = 'C:/PhotoList'

# JPGディレクトリ
JPG_DIRECTORY = 'C:/PhotoList/temp/JPG'

# RAWディレクトリ
RAW_DIRECTORY = 'C:/PhotoList/temp/RAW'

# connection
conn = None

# cursor
cursor = None

"""
  画像圧縮取込み
"""
def picCompIntake(year, date):
  if not os.path.isdir(SAVE_DIRECTORY + '/' + year):
    # 年のフォルダ作成
    os.mkdir(SAVE_DIRECTORY + '/' + year)

  if os.path.isdir(SAVE_DIRECTORY + '/' + year + '/' + date):
    # フォルダの中身を削除
    shutil.rmtree(SAVE_DIRECTORY + '/' + year + '/' + date)

  # 日付のフォルダ作成
  os.mkdir(SAVE_DIRECTORY + '/' + year + '/' + date)

  directory = JPG_DIRECTORY + '/' + date
  for placeFolder in os.listdir(directory):
    # 場所のフォルダ作成
    os.mkdir(SAVE_DIRECTORY + '/' + year + '/' + date + '/' + placeFolder)

    # 画像処理
    for fileName in os.listdir(directory + '/' + placeFolder):
      # 元画像を読み込み
      img = Image.open(directory + '/' + placeFolder + '/' + fileName)

      picW = 0
      picH = 0
      picQuality = 0
      if img.width > img.height:
        # 横
        picW = 600 * (img.width/img.height)
        picH = 600
        picQuality = 80
      else:
        # 縦
        picW = img.width / 5
        picH = img.height / 5
        picQuality = 75

      # 画像をリサイズ
      imgResized = img.resize((int(picW), int(picH)))
      # ファイルを保存
      imgResized.save(SAVE_DIRECTORY + '/' + year + '/' + date + '/' + placeFolder + '/' + fileName, quality=picQuality)

"""
  画像情報取込み
"""
def picInfoIntake(year, date):
  global conn
  global cursor

  try:
    # DB設定
    conn = mysql.connector.connect(
      user = JSON_DB['user'],
      password = JSON_DB['password'],
      host = JSON_DB['host'],
      database = JSON_DB['database']
    )
    cursor = conn.cursor()

    # テーブルロック
    sql = ("""LOCK TABLES PICTURE_INFO_TBL WRITE""")
    cursor.execute(sql)

    # レコード削除
    sql = ("""DELETE FROM PICTURE_INFO_TBL WHERE PICTURE_DATE = %s""")
    delParams = []
    delParams.append(date)
    cursor.execute(sql, delParams)

    directory = JPG_DIRECTORY + '/' + date
    for placeFolder in os.listdir(directory):
      for fileName in os.listdir(directory + '/' + placeFolder):
        # 横長 or 縦長
        wh = 'W'
        img = Image.open(directory + '/' + placeFolder + '/' + fileName)
        if img.width < img.height:
          wh = 'H'
        del img

        # 検索(画像撮影日時取得)
        picDatetime = None
        for rawFileName in os.listdir(RAW_DIRECTORY + '/' + date):
          if str(fileName).split('_')[1].split('.')[0].split('-')[0] == str(rawFileName).split('_')[1].split('.')[0]:
            picDatetime = os.stat(RAW_DIRECTORY + '/' + date + '/' + rawFileName).st_mtime
            break

        # レコード登録
        sql = ("""INSERT INTO PICTURE_INFO_TBL VALUES (NULL, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)""")
        params = []
        params.append(year)
        params.append(date)
        params.append(str(placeFolder))
        params.append(str(fileName))
        params.append(wh)
        params.append(datetime.fromtimestamp(picDatetime).strftime('%Y/%m/%d %H:%M:%S'))
        cursor.execute(sql, params)

    # テーブルロック解除
    sql = ("""UNLOCK TABLES""")
    cursor.execute(sql)

    # コミット
    conn.commit()
  except Exception as e:
    conn.rollback()
    raise e
  finally:
    if cursor is not None:
      cursor.close()
    if conn is not None and conn.is_connected():
      conn.close()

try:
  print('処理開始')
  picCompIntake(sys.argv[1], sys.argv[2])
  picInfoIntake(sys.argv[1], sys.argv[2])
except Exception as e:
  print(e)
finally:
  print('処理終了')
