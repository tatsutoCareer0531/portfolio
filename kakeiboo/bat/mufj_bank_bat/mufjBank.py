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

# 三菱UFJ銀行ログインTOPページ
MUFJ_BANK_LOGIN_URL = 'https://entry11.bk.mufg.jp/ibg/dfw/APLIN/loginib/login?_TRANID=AG004_001&link_id=direct_leftmenu_login_PC'

# ユーザー情報
USER_INFO = {
  'contractNumber': '',
  'password': '',
  'account_number': ''
}

# 現在時刻
CURRENT_DATE = datetime.now()

# 年月日時分秒
YEAR_MONTH_DATETIME = CURRENT_DATE.strftime('%Y%m%d%H%M%S')

# ログフォルダパス
LOG_PATH = 'C:/MakeApp/kakeiboo/log/bat/mufj_bank/' + CURRENT_DATE.strftime('%Y%m%d')

# connection
conn = None

# cursor
cursor = None

# ログ内容
logStrArr = []

# 預金額
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
    sql = ("""SELECT MUFJ_BANK_CONTRACT_NUMBER, MUFJ_BANK_PASSWORD, MUFJ_BANK_ACCOUNT_NUMBER FROM USER_MST WHERE ID = %s AND SYSTEM_PASSWORD = %s""")
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
  三菱UFJ銀行ネットバンキングにアクセス
"""
def accessMufjBank():
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

    # 三菱UFJ銀行ログイン画面へ遷移
    driver.get(MUFJ_BANK_LOGIN_URL)

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # 契約番号を入力
    el = driver.find_element(By.ID, "tx-contract-number")
    el.clear()
    el.send_keys(USER_INFO['contractNumber'])
    # PASSWORDを入力
    el = driver.find_element(By.ID, "tx-ib-password")
    el.clear()
    el.send_keys(USER_INFO['password'])
    # ログインボタン押下
    button = driver.find_element(By.XPATH, "/html/body/app-root/app-lgppu01-wf/div/main/div/app-index/form/section/div/div/div[1]/div[3]/div/button")
    button.click()

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)

    # # お知らせ一覧が存在した場合
    # infoListTitleTag = driver.find_elements(By.XPATH, '//*[@id="contents"]/div[2]/div[1]/h2')
    # if len(infoListTitleTag) > 0:
    #   # 表示ボタンを押下
    #   viewButton = driver.find_element(By.XPATH, '//*[@id="contents"]/div[2]/div[1]/table/tbody/tr/td[5]/form/input[4]')
    #   viewButton.click()

    #   # 待機
    #   WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    #   time.sleep(10)

    #   # トップボタンを押下
    #   topButton = driver.find_element(By.XPATH, '//*[@id="contents"]/div[2]/div[2]/input[1]')
    #   topButton.click()

    #   # 待機
    #   WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    #   time.sleep(10)

    # 口座番号確認
    accountNumber = driver.find_element(By.XPATH, "/html/body/app-root/app-lgpu01-wf/div/main/div/app-lgpu01-lg0002-m00-c01/form/section/div/div[1]/div/div[2]/section[1]/a/div[1]/div[2]").get_attribute('innerHTML')
    accountNumberArray = accountNumber.split(' ')
    if USER_INFO['account_number'] != accountNumberArray[2] :
      raise Exception('口座番号確認エラー')
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 口座番号確認完了', 'level': 'info'})

    # 預金額取得
    global deposit
    deposit = driver.find_element(By.XPATH, "/html/body/app-root/app-lgpu01-wf/div/main/div/app-lgpu01-lg0002-m00-c01/form/section/div/div[1]/div/div[2]/section[1]/a/div[1]/div[3]/span[1]").get_attribute('innerHTML')
    deposit = deposit.replace(',','')

    # ログアウトボタン押下
    button = driver.find_element(By.XPATH, "/html/body/app-root/app-lgpu01-wf/div/header/nav/div[2]/a[2]")
    button.click()

    # 待機
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located)
    time.sleep(10)
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 三菱UFJ銀行ネットバンキングアクセスエラー発生: ' + str(e), 'level': 'error'})
    raise e
  finally :
    if driver is not None:
      driver.quit()

"""
  預金額データを登録
"""
def registDepositData():
  try:
    global cursor
    cursor = conn.cursor()

    # 三菱UFJ預金額テーブルロック
    sql = ("""LOCK TABLES MUFJ_DEPOSIT_TBL WRITE""")
    cursor.execute(sql)

    # レコード削除
    sql = ("""DELETE FROM MUFJ_DEPOSIT_TBL""")
    cursor.execute(sql)

    # レコード登録
    sql = ("""INSERT INTO MUFJ_DEPOSIT_TBL VALUES ('1', %s, CURRENT_TIMESTAMP)""")
    params = []
    params.append(deposit)
    cursor.execute(sql, params)

    # テーブルロック解除
    sql = ("""UNLOCK TABLES""")
    cursor.execute(sql)

    # コミット
    conn.commit()
  except Exception as e:
    logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 預金額データ登録エラー発生: ' + str(e), 'level': 'error'})
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
      USER_INFO['contractNumber'] = result[0][0]
      USER_INFO['password'] = result[0][1]
      USER_INFO['account_number'] = result[0][2]

      # 三菱UFJ銀行にアクセス
      accessMufjBank()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 三菱UFJ銀行アクセス完了', 'level': 'info'})

      # 預金額データを登録
      registDepositData()
      logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 預金額データ登録完了', 'level': 'info'})
    else:
      raise Exception('ユーザー情報なし')
except Exception as e:
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 三菱UFJ銀行バッチエラー発生: ' + str(e), 'level': 'error'})
  makeLogFile()
finally:
  if conn is not None and conn.is_connected():
    conn.close()
  logStrArr.append({'log': datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理終了', 'level': 'info'})
