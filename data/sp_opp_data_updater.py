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
    # the second line has the sp opportunity date update datetime
    renewal_date = datetime.strptime(lines[1].split(":")[-1].strip().rstrip("\n"), datetime_format_str)


authorization = (metu_username, metu_password)
main_url = "https://sp-ie.metu.edu.tr/en/sp-opportunities"
url_request = re.get(main_url, auth=authorization)
soup = bs(url_request.text, "html5lib")

# After accessing, we can see the last update date-time:
date_div = soup.find_all("div", class_="pane-content")[-1]
last_update_time = datetime.strptime(date_div.contents[0].strip("\n").strip(), '%d/%m/%Y - %H:%M')

if renewal_date >= last_update_time:
    sys.exit(0)

else:
    # If needs updating, then we will update the txt file containing the data:
    table_body = soup.find("tbody")
    rows_of_data = table_body.find_all("tr")

    sp_opps_data = []

    for row in rows_of_data:
        cols = row.find_all("td")
        cols_text = [col.get_text(strip=True) for col in cols]
        sp_opps_data.append(cols_text)

    today_str = datetime.now().strftime(datetime_format_str)

    with open(f"../added_files/Sp-opportunities.txt", "w", encoding="utf-8") as f:
        f.write("This is the first line of the file, the line exactly below this contains the column names and the lines below that contains the rows of data of companies for internship. Delimiter is ;\n")
        for row in sp_opps_data:
            if row:
                f.write(";".join(row) + "\n")

    with open("./data_renewal_date.txt", "r+", encoding="utf-8") as date_file:
        lines = list(date_file)
        line_to_update = lines[1]
        parts = line_to_update.strip("\n").split(": ")
        parts[1] = today_str
        line_to_update = ": ".join(parts)
        lines[1] = line_to_update
        date_file.truncate(0)
        date_file.seek(0)
        date_file.writelines(lines)
    sys.exit(10)
