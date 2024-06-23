import os
import json
import logging
import requests
import mysql.connector
from bs4 import BeautifulSoup
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta


# JSONパス
JSON_PATH = 'C:/MakeApp/kakeiboo/bat/kakeiboo_bat.json'

# JSON
JSON = json.load(open(JSON_PATH, 'r'))

# JSON_DB
JSON_DB = JSON['db']

# 現在時刻
CURRENT_DATE = datetime.now()

# 年月日時分秒
YEAR_MONTH_DATETIME = CURRENT_DATE.strftime('%Y%m%d%H%M%S')

# ログフォルダパス
LOG_PATH = 'C:/MakeApp/kakeiboo/log/bat/news_weather/' + CURRENT_DATE.strftime('%Y%m%d')

# connection
conn = None

# cursor
cursor = None

# ログ内容
logStrArr = []

"""
  yahooニュース情報取得
"""
def getNewsInfo():
  yahooURL = "https://news.yahoo.co.jp/"
  yahooHTML = requests.get(yahooURL)
  yahooSoup = BeautifulSoup(yahooHTML.content, "html.parser")

  yahooCmTrate = yahooSoup.find(id="cmtrate")
  newsList = []
  for cmTrate in yahooCmTrate("a"):
    # urlを取得
    cmTrateURL = cmTrate.get("href")
    if("/ranking/comment" != cmTrateURL):
      cmTrateHTML = requests.get(cmTrateURL)
      cmTrateSoup = BeautifulSoup(cmTrateHTML.content, "html.parser")
      for el in cmTrateSoup.find_all("h1"):
        if("Yahoo!ニュース" != el.text):
          newsList.append(el.text)

  return newsList

"""
  yahoo天気情報取得
"""
def getWeatherInfo():
  yahooURL = "https://weather.yahoo.co.jp/weather/jp/3.html?day=1"
  yahooHTML = requests.get(yahooURL)
  yahooSoup = BeautifulSoup(yahooHTML.content, "html.parser")

  yahooMap = yahooSoup.find(id="map")
  weatherList = []
  for yMap in yahooMap("li"):
    weather = {
      "place" : yMap.find("dt", class_="name").text,
      "status" : yMap.find("img").get('alt'),
      "highTemp" : yMap.find("em", class_="high").text,
      "lowTemp" : yMap.find("em", class_="low").text,
      "precip" : yMap.find("p", class_="precip").text
    }
    weatherList.append(weather)

  return weatherList

"""
  現在時間(日の出、日の入)のフラグ取得
"""
def getSunRiseSetFlg():
  # webページから日の出、日の入時刻取得
  sunRiseSetURL = "http://www.hinode-hinoiri.com/130001.html"
  sunRiseSetHTML = requests.get(sunRiseSetURL)
  sunRiseSetSoup = BeautifulSoup(sunRiseSetHTML.content, "html.parser")
  sunRiseSetList = sunRiseSetSoup.find_all('td', class_='size32')

  sunRiseText = sunRiseSetList[0].text
  sunSetText = sunRiseSetList[1].text

  # 日の出時間の配列取得
  sunRiseText = sunRiseText.replace("時", ",").replace("分", "")
  sunRiseArray = sunRiseText.split(",")
  # 日の入時間の配列取得
  sunSetText = sunSetText.replace("時", ",").replace("分", "")
  sunSetArray = sunSetText.split(",")

  riseTime = sunRiseArray[0] + sunRiseArray[1].zfill(2)
  setTime = sunSetArray[0] + sunSetArray[1].zfill(2)

  # 現在時間取得
  dtNow = datetime.now()
  dtNowArray = dtNow.strftime('%H:%M').split(":")
  dtNowTime = dtNowArray[0] + dtNowArray[1].zfill(2)

  sunSetRiseFlg = "0"
  if(int(riseTime) <= int(dtNowTime) and int(dtNowTime) < int(setTime)):
    # 昼
    sunSetRiseFlg = "0"
  else:
    # 夜
    sunSetRiseFlg = "1"

  return sunSetRiseFlg

"""
  ログファイル作成
"""
def makeLogFile():
  # ログファイル作成
  os.makedirs(LOG_PATH, exist_ok=True)
  logging.basicConfig(filename=LOG_PATH + '/' + YEAR_MONTH_DATETIME + '.log', level=logging.INFO)
  for log in logStrArr:
    if log['level'] == 'info':
      logging.info(log['log'])
    else:
      logging.error(log['log'])

try:
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理開始', 'level': 'info'})

  # DB設定
  conn = mysql.connector.connect(
    user = JSON_DB['user'],
    password = JSON_DB['password'],
    host = JSON_DB['host'],
    database = JSON_DB['database']
  )

  cursor = conn.cursor()

  # yahooニュース情報取得
  newsList = getNewsInfo()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' yahooニュース情報取得完了', 'level': 'info'})

  # yahoo天気情報取得
  weatherList = getWeatherInfo()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' yahoo天気情報取得完了', 'level': 'info'})

  # 現在時間(日の出、日の入)のフラグ取得
  sunSetRiseFlg = getSunRiseSetFlg()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 現在時間(日の出、日の入)のフラグ取得完了', 'level': 'info'})

  # ニューステーブル、天気テーブルロック
  sql = ("""LOCK TABLES NEWS_TBL WRITE, WEATHER_TBL WRITE""")
  cursor.execute(sql)    

  # レコード削除(ニュース)
  sql = ("""DELETE FROM NEWS_TBL""")
  cursor.execute(sql)

  # レコード登録(ニュース)
  newsId = 0
  sql = ("""INSERT INTO NEWS_TBL VALUES (%s, %s, CURRENT_TIMESTAMP)""")
  for news in newsList:
    params = []
    newsId += 1
    params.append(newsId)
    params.append(news)
    cursor.execute(sql, params)

  # レコード削除(天気)
  sql = ("""DELETE FROM WEATHER_TBL""")
  cursor.execute(sql)

  # レコード登録(天気)
  weatherId = 0
  sql = ("""INSERT INTO WEATHER_TBL VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)""")
  for weather in weatherList:
    params = []
    weatherId += 1
    params.append(weatherId)
    params.append(weather["place"])
    params.append(weather["status"])
    params.append(weather["highTemp"])
    params.append(weather["lowTemp"])
    params.append(weather["precip"])
    params.append(sunSetRiseFlg)
    cursor.execute(sql, params)

  # テーブルロック解除
  sql = ("""UNLOCK TABLES""")
  cursor.execute(sql)

  conn.commit()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' レコード登録処理完了', 'level': 'info'})
except Exception as e:
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' ニュース情報取得バッチエラー発生: ' + str(e), 'level': 'error'})
  conn.rollback()
  makeLogFile()
finally:
  if cursor is not None:
    cursor.close()
  if conn is not None and conn.is_connected():
    conn.close()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理終了', 'level': 'info'})
