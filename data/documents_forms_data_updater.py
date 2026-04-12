import requests as re
from bs4 import BeautifulSoup as bs
from datetime import datetime
from dotenv import load_dotenv
import os
import sys

load_dotenv("../.env.local")
metu_username = os.getenv("USER_NAME_METU")
metu_password = os.getenv("PASSWORD_METU")

# Read the last renewal date before updating:
datetime_format_str = "%d-%m-%Y-%H-%M"
with open("./data_renewal_date.txt", "r", encoding="utf-8") as date_file:
    lines = list(date_file)
    # the first line has the docs and forms last renewal datetime
    renewal_date = datetime.strptime(lines[0].split(":")[-1].strip().rstrip("\n"), datetime_format_str)


authorization = (metu_username, metu_password)
main_url = "https://sp-ie.metu.edu.tr/en/forms"
url_request = re.get(main_url, auth=authorization)
soup = bs(url_request.text, "html5lib")

# After accessing, we can see the last update date-time:
date_div = soup.find_all("div", class_="pane-content")[-1]
last_update_time = datetime.strptime(date_div.contents[0].strip("\n").strip(), '%d/%m/%Y - %H:%M')

if renewal_date >= last_update_time:
    sys.exit(0)

else:
    # If needs updating, then we will delete all existing files and re-download them:
    documents_path = "../added_files/files/" # Folder path
    dirlist = os.listdir(documents_path)
    
    for filename in dirlist:
        os.remove(documents_path + filename)

    links = [a.get("href") for a in soup.find_all("a", href=True)]
    file_links = [l for l in links if l and l.lower().endswith((".pdf", ".docx", ".doc"))]
    base_url = "https://sp-ie.metu.edu.tr"
    
    for url in file_links:
        if url.startswith("/"): # this is due to the fact that the links we collected are relative to the base url
            url = base_url + url

        filename = os.path.basename(url)

        if "ie300-manual_0.pdf" == filename:
            continue

        r = re.get(url, auth=authorization)
        with open(documents_path + filename, "wb") as f:
            f.write(r.content)

    # Updating documents renewal date:
    with open("./data_renewal_date.txt", "r+", encoding="utf-8") as date_file:
        lines = list(date_file)
        today_str = datetime.now().strftime(datetime_format_str)
        first_line = lines[0]
        new_first_line = first_line.split(": ")[0] + ": " + today_str + "\n"
        lines = [new_first_line, lines[1]]
        date_file.truncate(0)
        date_file.seek(0)
        date_file.writelines(lines)
    sys.exit(10)
