import os
import time
import json
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

# 東日本銀行ログインTOPページ
HIGASHI_BANK_LOGIN_URL = 'https://www.parasol.anser.ne.jp/ib/index.do?PT=BS&CCT0080=0525'

# ユーザー情報
USER_INFO = {
  'id': '',
  'password': '',
  'account_number': ''
}

# 現在時刻
CURRENT_DATE = datetime.now()

# 年月日時分秒
YEAR_MONTH_DATETIME = CURRENT_DATE.strftime('%Y%m%d%H%M%S')

# ログフォルダパス
LOG_PATH = 'C:/MakeApp/kakeiboo/log/bat/higashi_bank/' + CURRENT_DATE.strftime('%Y%m%d')

# connection
conn = None

# cursor
cursor = None

# ログ内容
logStrArr = []

# 貯金額
deposit = '0'

"""
  ユーザー情報を取得
"""
def getUserInfo():
  result = []
  try:
    global cursor
    cursor = conn.cursor()

    # ユーザー情報取得
    sql = ("""SELECT HIGASHI_BANK_ID, HIGASHI_BANK_PASSWORD, HIGASHI_BANK_ACCOUNT_NUMBER FROM USER_MST WHERE ID = %s AND SYSTEM_PASSWORD = %s""")
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
  東日本銀行ネットバンキングにアクセス
"""
def accessHigashiBank():
  # driver
  driver = None

  try:
    # option設定
    options = Options()
    options.add_argument('--headless')  # ヘッドレスモード
    options.add_argument('--disable-gpu')
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument('--ignore-certificate-errors') #SSLエラー対策
    options.add_argument('--disable-blink-features=AutomationControlled') #webdriver検出を回避
    options.add_argument('--blink-settings=imagesEnabled=false') #画像非表示

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

    # 東日本銀行ログイン画面へ遷移
    driver.get(HIGASHI_BANK_LOGIN_URL)

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # ID入力
    el = driver.find_element(By.ID, "txtBox003")
    el.clear()
    el.send_keys(USER_INFO['id'])
    # PASSWORD入力
    el = driver.find_element(By.ID, "pswd005")
    el.clear()
    el.send_keys(USER_INFO['password'])
    # ログインボタン押下
    button = driver.find_element(By.ID, "btn010")
    button.click()

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # ログインされた状態のままから入って、再度ログインする場合
    reLoginEl = driver.find_elements(By.ID, "btn003")
    if len(reLoginEl) > 0:
      if reLoginEl[0].get_attribute('innerHTML') == '再ログイン':
        reLoginEl[0].click()
        WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
        time.sleep(10)

    # ワンタイムパスワード利用申請しない ラジオボタン押下
    button = driver.find_element(By.ID, "radio002")
    button.click()

    # 次へボタン押下
    button = driver.find_element(By.ID, "btn001")
    button.click()

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # 口座番号確認    
    accountNumber = driver.find_element(By.ID, "msg004-1").get_attribute('innerHTML')
    if USER_INFO['account_number'] != accountNumber:
      raise Exception('口座番号確認エラー')
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 口座番号確認完了', 'level': 'info'})

    # 貯金額取得
    global deposit
    deposit = driver.find_element(By.ID, "msg107-1").get_attribute('innerHTML')
    deposit = deposit.replace(',','').replace('円','')

    # ログアウトボタン押下
    button = driver.find_element(By.ID, "cs_globalButton_logout")
    button.click()

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 東日本銀行ネットバンキングアクセスエラー発生: ' + str(e), 'level': 'error'})
    raise e
  finally:
    if driver is not None:
      driver.quit()

"""
  貯金額データを登録
"""
def registDepositData():
  try:
    global cursor
    cursor = conn.cursor()

    # 東日本貯金額テーブルロック
    sql = ("""LOCK TABLES HIGASHI_DEPOSIT_TBL WRITE""")
    cursor.execute(sql)    

    # 年月取得
    yearMonth = CURRENT_DATE.strftime('%Y/%m')

    # レコード削除
    sql = ("""DELETE FROM HIGASHI_DEPOSIT_TBL WHERE DEPOSIT_DATE = %s""")
    delParams = []
    delParams.append(yearMonth)
    cursor.execute(sql, delParams)

    # レコード登録
    sql = ("""INSERT INTO HIGASHI_DEPOSIT_TBL VALUES (%s, %s, CURRENT_TIMESTAMP)""")
    params = []
    params.append(yearMonth)
    params.append(deposit)
    cursor.execute(sql, params)

    # テーブルロック解除
    sql = ("""UNLOCK TABLES""")
    cursor.execute(sql)

    # コミット
    conn.commit()
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 貯金額データ登録エラー発生: ' + str(e), 'level': 'error'})
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

  if 10 <= CURRENT_DATE.hour and CURRENT_DATE.hour <= 22:
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
      USER_INFO['account_number'] = result[0][2]

      # 東日本銀行にアクセス
      accessHigashiBank()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 東日本銀行アクセス完了', 'level': 'info'})

      # 貯金額データを登録
      registDepositData()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 貯金額データ登録完了', 'level': 'info'})
    else:
      raise Exception('ユーザー情報なし')
except Exception as e:
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 東日本銀行バッチエラー発生: ' + str(e), 'level': 'error'})
  makeLogFile()
finally:
  if conn is not None and conn.is_connected():
    conn.close()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理終了', 'level': 'info'})
