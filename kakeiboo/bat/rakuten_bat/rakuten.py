import os
import json
import time
import logging
import requests
import mysql.connector
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome import service as fs
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.select import Select
from webdriver_manager.chrome import ChromeDriverManager


# JSONパス
JSON_PATH = 'C:/MakeApp/kakeiboo/bat/kakeiboo_bat.json'

# JSON
JSON = json.load(open(JSON_PATH, 'r'))

# JSON_DB
JSON_DB = JSON['db']

# 楽天ログインページ
RAKUTEN_LOGIN_URL = 'https://www.rakuten-card.co.jp/e-navi/'

# 楽天TOPページ
RAKUTEN_TOP_URL = 'https://www.rakuten-card.co.jp/e-navi/members/index.xhtml?l-id=enavi_logout_cwd_login'

# 楽天明細ページ
RAKUTEN_MEISAI_URL = 'https://www.rakuten-card.co.jp/e-navi/members/statement/index.xhtml?tabNo='

# 楽天ログアウト確認ページ
RAKUTEN_LOGOUT_URL = 'https://www.rakuten-card.co.jp/e-navi/logout.xhtml?l-id=enavi_prelogout_cwd_logout'

# ユーザー情報
USER_INFO = {
  'id': '',
  'password': '',
  'card_number_1': '',
  'card_number_2': ''
}

# 現在時刻
CURRENT_DATE = datetime.now()

# 年月日時分秒
YEAR_MONTH_DATETIME = CURRENT_DATE.strftime('%Y%m%d%H%M%S')

# ログフォルダパス
LOG_PATH = 'C:/MakeApp/kakeiboo/log/bat/rakuten/' + CURRENT_DATE.strftime('%Y%m%d')

# connection
conn = None

# cursor
cursor = None

# driver
driver = None

# ログ内容
logStrArr = []

# 利用年月(一時保存)
usageDateTempList = []

# 利用年月
usageDateList = []

# 明細情報
meisaiData = []

"""
  ユーザー情報を取得
"""
def getUserInfo():
  result = []
  try:
    global cursor
    cursor = conn.cursor()

    # ユーザー情報取得
    sql = ("""SELECT RAKUTEN_ID, RAKUTEN_PASSWORD, RAKUTEN_CARD_NUMBER_1, RAKUTEN_CARD_NUMBER_2 FROM USER_MST WHERE ID = %s AND SYSTEM_PASSWORD = %s""")
    params = []
    params.append(JSON['id'])
    params.append(JSON['password'])
    cursor.execute(sql, params)
    result = cursor.fetchall()
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' ユーザー情報取得エラー発生: ' + str(e), 'level': 'error'})
    raise e
  finally:
    if cursor is not None:
      cursor.close()
  return result

"""
  楽天にアクセス
"""
def accessRakutenLogin():
  try:
    # 楽天画面へ遷移
    driver.get(RAKUTEN_LOGIN_URL)

    # 待機
    WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # ID入力
    el = driver.find_element(By.ID, "u")
    el.clear()
    el.send_keys(USER_INFO['id'])
    # PASSWORD入力
    el = driver.find_element(By.ID, "p")
    el.clear()
    el.send_keys(USER_INFO['password'])
    # ボタン押下
    button = driver.find_element(By.ID, "loginButton")
    button.click()

    # 待機
    WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
    time.sleep(10)
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 楽天アクセスエラー発生: ' + str(e), 'level': 'error'})
    raise e

"""
  明細ページにアクセス
"""
def accessRakutenMeisai(cardNumber, creditNumber):
  try:
    # TOPページへ遷移
    driver.get(RAKUTEN_TOP_URL)

    # 待機
    WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    dropdown = driver.find_element(By.XPATH, '//*[@id="cardChangeForm:cardtype"]')
    select = Select(dropdown)
    select.select_by_value('0')

    # 待機
    WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # カード番号を確認
    cardNumEl = driver.find_elements(By.CLASS_NAME, 'rd-registCard-number')
    cardNumArr = cardNumEl[0].get_attribute('innerHTML').split(' - ')
    if len(cardNumArr) != 4 or cardNumArr[3].replace(' ', '').replace('\n', '') != creditNumber:
      select.select_by_value('1')

      # 待機
      WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
      time.sleep(10)

      # カード番号を確認
      cardNumEl = driver.find_elements(By.CLASS_NAME, 'rd-registCard-number')
      cardNumArr = cardNumEl[0].get_attribute('innerHTML').split(' - ')
      if len(cardNumArr) != 4 or cardNumArr[3].replace(' ', '').replace('\n', '') != creditNumber:
        raise Exception('カード番号確認エラー')
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' カード番号確認完了', 'level': 'info'})

    # 利用履歴明細ページへ遷移
    global usageDateList
    for i in range(5):
      driver.get(RAKUTEN_MEISAI_URL + str(i))

      # 待機
      WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
      time.sleep(10)

      # ページタイトルの年月を取得
      titleYearMonthEl = driver.find_element(By.XPATH, '//*[@id="js-payment-calendar-btn"]/span')
      titleYearMonthStr = titleYearMonthEl.get_attribute('innerHTML').replace('年', '/').replace('月', '/')
      titleYearMonthArr = titleYearMonthStr.split('/')
      titleYear = titleYearMonthArr[0]
      titleMonth = titleYearMonthArr[1]

      # 利用年月を取得
      ym = datetime(int(titleYear), int(titleMonth), 1)
      # 利用年月 一番最初の明細ページの次月用
      usageDateNext = datetime.strftime(ym, '%Y/%m')
      usageDateTempList.append(usageDateNext)
      usageDateList = list(set(usageDateTempList))
      ymOneMonthAgo = ym-relativedelta(months=1)
      # 利用年月 明細ページの当月用
      usageDate = datetime.strftime(ymOneMonthAgo, '%Y/%m')
      usageDateTempList.append(usageDate)
      usageDateList = list(set(usageDateTempList))

      # 利用履歴一覧を取得
      stmtcSection = driver.find_elements(By.CLASS_NAME, 'stmt-c-section')
      if len(stmtcSection) > 0:
        for el in driver.find_elements(By.CLASS_NAME, 'stmt-c-section'):
          stmtcTtllv3El = el.find_elements(By.CLASS_NAME, 'stmt-c-ttl--lv3')
          if len(stmtcTtllv3El) > 0:
            h3El = stmtcTtllv3El[0].find_elements(By.TAG_NAME, 'h3')
            if len(h3El) > 0:
              targetMonth = ''
              if h3El[0].get_attribute('innerHTML')[0].isdecimal():
                targetMonth += h3El[0].get_attribute('innerHTML')[0]
                if h3El[0].get_attribute('innerHTML')[1].isdecimal():
                  targetMonth += h3El[0].get_attribute('innerHTML')[1]
              if targetMonth:
                if int(targetMonth) == int(titleMonth):
                  # 明細情報を取得(上段)
                  if getMeisaiData(el, cardNumber, usageDate, 'current'):
                    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報あり カード番号: ' + cardNumber + ' ページ : ' + str(i+1) + ' 利用年月 : ' + usageDate, 'level': 'info'})
                else:
                  # 明細情報を取得(下段 一番最初の明細ページの次月)
                  if getMeisaiData(el, cardNumber, usageDateNext, 'next'):
                    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報あり カード番号: ' + cardNumber + ' ページ : ' + str(i+1) + ' 利用年月 : ' + usageDateNext, 'level': 'info'})

    # TOPページへ遷移
    driver.get(RAKUTEN_TOP_URL)

    # 待機
    WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
    time.sleep(10)
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細ページアクセスエラー発生: ' + str(e), 'level': 'error'})
    raise e

"""
  明細情報を取得
"""
def getMeisaiData(el, cardNumber, usageDate, strEl):
  resultFlg = False
  try:
    # データ取得、登録
    listEl = el.find_elements(By.CLASS_NAME, f'stmt-{strEl}-payment-list')
    if len(listEl) > 0:
      listBodyEl = listEl[0].find_elements(By.CLASS_NAME, f'stmt-{strEl}-payment-list-body')
      if len(listBodyEl) > 0:
        listData = listBodyEl[0].find_elements(By.CLASS_NAME, 'stmt-payment-lists__i')
        if len(listData) > 0:
          i = 1
          for data in listData:
            jsonData = json.loads(data.get_attribute('data-sort'))
            if not (str(jsonData['payment']).find('分割変更') > -1 and str(jsonData['payment']).find('以降') > -1):
              # 明細情報設定
              strList = list(str(jsonData['date']))
              strList.insert(4, '/')
              strList.insert(7, '/')
              date = ''.join(strList)
              year = usageDate.split('/')[0]
              month = usageDate.split('/')[1]
              meisai = {
                'id': year + month + cardNumber + str(i).zfill(3),
                'card_number': cardNumber,
                'credit_usage_date': usageDate,
                'credit_date': date,
                'name': jsonData['name'],
                'amount': jsonData['amount']
              }
              meisaiData.append(meisai)
              i = i + 1
              resultFlg = True
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報取得エラー発生: ' + str(e), 'level': 'error'})
    raise e
  return resultFlg

"""
  楽天からログアウト
"""
def accessRakutenLogout():
  try:
    # 楽天ログアウトページへ遷移
    driver.get(RAKUTEN_LOGOUT_URL)
    # 待機
    WebDriverWait(driver, 20).until(EC.presence_of_all_elements_located)
    time.sleep(10)
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 楽天ログアウトエラー発生: ' + str(e), 'level': 'error'})
    raise e

"""
  明細情報登録
"""
def registMeisaiData():
  try:
    global cursor
    cursor = conn.cursor()

    # 貯金額テーブルロック
    sql = ("""LOCK TABLES RAKUTEN_CREDIT_TBL WRITE""")
    cursor.execute(sql)    

    # 明細情報データ削除
    for usageDate in usageDateList:
      sql = ("""DELETE FROM RAKUTEN_CREDIT_TBL WHERE CREDIT_USAGE_DATE = %s""")
      delParams = []
      delParams.append(usageDate)
      cursor.execute(sql, delParams)

    # 明細情報データを登録
    for data in meisaiData:
      sql = ("""INSERT INTO RAKUTEN_CREDIT_TBL VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)""")
      params = []
      params.append(data['id'])
      params.append(data['card_number'])
      params.append(data['credit_usage_date'])
      params.append(data['credit_date'])
      params.append(data['name'])
      params.append(data['amount'])
      cursor.execute(sql, params)

    # テーブルロック解除
    sql = ("""UNLOCK TABLES""")
    cursor.execute(sql)

    # コミット
    conn.commit()
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報登録エラー発生: ' + str(e), 'level': 'error'})
    conn.rollback()
    raise e
  finally:
    if cursor is not None:
      cursor.close()

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

  if 10 <= CURRENT_DATE.hour and CURRENT_DATE.hour <= 22 :
    # DB設定
    conn = mysql.connector.connect(
      user = JSON_DB['user'],
      password = JSON_DB['password'],
      host = JSON_DB['host'],
      database = JSON_DB['database']
    )

    # ユーザー情報を取得
    result = getUserInfo()
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' ユーザー情報取得完了', 'level': 'info'})

    if len(result) > 0:
      # ユーザー情報設定
      USER_INFO['id'] = result[0][0]
      USER_INFO['password'] = result[0][1]
      USER_INFO['card_number_1'] = result[0][2]
      USER_INFO['card_number_2'] = result[0][3]

      # option設定
      options = Options()
      options.add_argument('--disable-gpu')
      options.add_experimental_option('excludeSwitches', ['enable-logging'])
      options.add_argument('--ignore-certificate-errors') #SSLエラー対策
      options.add_argument('--disable-blink-features=AutomationControlled') #webdriver検出を回避
      options.add_argument('--blink-settings=imagesEnabled=false') #画像非表示

      # ログイン処理後、明細ページを3~4回ほど遷移すると原因不明のタイムアウトエラーが起こる
      # ヘッドレスモードをOFFにすると問題なく処理が終わるため、とりあえずOFFにしておく
      # ※ちなみにログイン後のメニュー画面を用いて↑と同じことを試しても問題はなかった
      # options.add_argument('--headless')  # ヘッドレスモード

      # try:
      #   # 最新バージョンのChromeドライバーを取得
      #   driverPath = ChromeDriverManager().install()
      #   driver = webdriver.Chrome(executable_path=driverPath, options=options)
      # except ValueError:
      #   # エラーが発生した場合、バージョンを指定してインストール
      #   response = requests.get('https://chromedriver.storage.googleapis.com/LATEST_RELEASE')
      #   driverPath = ChromeDriverManager(version=response.text).install()
      #   driver = webdriver.Chrome(executable_path=driverPath, options=options)

      # 応急処置
      chromeService = fs.Service(executable_path='C:/MakeApp/kakeiboo/chromedriver/chromedriver')
      driver = webdriver.Chrome(service=chromeService, options=options)

      # 楽天にアクセス
      accessRakutenLogin()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 楽天アクセス完了', 'level': 'info'})

      # 明細情報を取得(1枚目)
      accessRakutenMeisai('1', USER_INFO['card_number_1'])
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報取得完了 : card_number_1', 'level': 'info'})

      # 明細情報を取得(2枚目)
      accessRakutenMeisai('2', USER_INFO['card_number_2'])
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報取得完了 : card_number_2', 'level': 'info'})

      # 楽天からログアウト
      accessRakutenLogout()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報取得完了 : card_number_2', 'level': 'info'})

      # 明細情報を登録
      registMeisaiData()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 明細情報登録処理完了', 'level': 'info'})
    else:
      raise Exception('ユーザー情報なし')
except Exception as e:
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 楽天バッチエラー発生: ' + str(e), 'level': 'error'})
  makeLogFile()
finally:
  if conn is not None and conn.is_connected():
    conn.close()
  if driver is not None:
    driver.quit()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理終了', 'level': 'info'})
