import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate
from datetime import datetime, date, timedelta


# 現在時刻
CURRENT_DATE = datetime.now()

# 年月日時分秒
YEAR_MONTH_DATETIME = CURRENT_DATE.strftime('%Y%m%d%H%M%S')

# ログフォルダパス
LOG_PATH = 'C:/MakeApp/kakeiboo/log/bat/error_mail/' + CURRENT_DATE.strftime('%Y%m%d') + '.log'

# ログフォルダパス(東日本銀行)
LOG_HIGASHI = 'C:/MakeApp/kakeiboo/log/bat/higashi_bank/'

# ログフォルダパス(三菱UFJ銀行)
LOG_MUFJ = 'C:/MakeApp/kakeiboo/log/bat/mufj_bank/'

# ログフォルダパス(ニュース情報取得)
LOG_NEWS_WEATHER = 'C:/MakeApp/kakeiboo/log/bat/news_weather/'

# ログフォルダパス(楽天)
LOG_RAKUTEN = 'C:/MakeApp/kakeiboo/log/bat/rakuten/'

# SMTP接続用/送信用 メールアドレス
fromAddress = 'SMTP接続用/送信用メールアドレス'

# SMTP接続用パスワード
password = 'SMTP接続用パスワード'

# メール件名
subject = 'バッチエラーログ情報'

# 受信用メールアドレス
toAddress = '受信用メールアドレス'

"""
  メール本文作成
"""
def getMailText():
  mailText = 'バッチエラーログ情報をお知らせします。\n\n'

  # 起動年月日の直近3日分のログフォルダ内にファイルが存在するかチェックし、メール本文作成(※起動年月日は含めない)
  for i in range(3, 0, -1):
    dateResult = CURRENT_DATE-timedelta(days=i)
    ymd = datetime.strftime(dateResult, '%Y%m%d')
    ymdSlash = datetime.strftime(dateResult, '%Y/%m/%d')

    # 年月日
    mailText += ymdSlash + '\n'
    logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' ' + ymdSlash)
    
    # 東日本銀行バッチ
    if os.path.exists(LOG_HIGASHI + ymd + '/') and len(os.listdir(LOG_HIGASHI + ymd + '/')) > 0:
      for fileName in os.listdir(LOG_HIGASHI + ymd + '/'):
        fileNameList = list(fileName[8:14])
        fileNameList.insert(2,':')
        fileNameList.insert(5,':')
        datetimeStr = ''.join(fileNameList)
        mailText += '東日本銀行バッチ ' + datetimeStr + '\n'
        logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 東日本銀行バッチ ' + fileName)

    # 三菱UFJ銀行バッチ
    if os.path.exists(LOG_MUFJ + ymd + '/') and len(os.listdir(LOG_MUFJ + ymd + '/')) > 0:
      for fileName in os.listdir(LOG_MUFJ + ymd + '/'):
        fileNameList = list(fileName[8:14])
        fileNameList.insert(2,':')
        fileNameList.insert(5,':')
        datetimeStr = ''.join(fileNameList)
        mailText += '三菱UFJ銀行バッチ ' + datetimeStr + '\n'
        logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 三菱UFJ銀行バッチ ' + fileName)

    # ニュース情報取得バッチ
    if os.path.exists(LOG_NEWS_WEATHER + ymd + '/') and len(os.listdir(LOG_NEWS_WEATHER + ymd + '/')) > 0:
      for fileName in os.listdir(LOG_NEWS_WEATHER + ymd + '/'):
        fileNameList = list(fileName[8:14])
        fileNameList.insert(2,':')
        fileNameList.insert(5,':')
        datetimeStr = ''.join(fileNameList)
        mailText += 'ニュース情報取得バッチ ' + datetimeStr + '\n'
        logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' ニュース情報取得バッチ ' + fileName)

    # 楽天バッチ
    if os.path.exists(LOG_RAKUTEN + ymd + '/') and len(os.listdir(LOG_RAKUTEN + ymd + '/')) > 0:
      for fileName in os.listdir(LOG_RAKUTEN + ymd + '/'):
        fileNameList = list(fileName[8:14])
        fileNameList.insert(2,':')
        fileNameList.insert(5,':')
        datetimeStr = ''.join(fileNameList)
        mailText += '楽天バッチ ' + datetimeStr + '\n'
        logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' 楽天バッチ ' + fileName)

    mailText += '\n'
  
  return mailText

try:
  # ログファイル作成
  logging.basicConfig(filename=LOG_PATH, level=logging.INFO)
  logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理開始')

  # メール本文作成
  mailText = getMailText()
  logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' メール本文作成完了')

  # SMTPサーバに接続
  smtpobj = smtplib.SMTP('smtp.gmail.com', 587)
  smtpobj.starttls()
  smtpobj.login(fromAddress, password)

  # メール作成
  msg = MIMEText(mailText)
  msg['Subject'] = subject
  msg['From'] = fromAddress
  msg['To'] = toAddress
  msg['Date'] = formatdate()

  # メール送信
  smtpobj.send_message(msg)
  smtpobj.close()

  logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' メール送信処理完了')
except Exception as e:
  logging.error(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' エラーメールバッチエラー発生: ' + str(e))
finally:
  logging.info(datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ' バッチ処理終了')
