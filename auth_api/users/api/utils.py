import re
from urllib.parse import unquote

# Encoded URL
encoded_url = "http://127.0.0.1:8000/?code=4%2F0AdLIrYcjYMq3ezOFk9zdI53rQITe83KUAu7PmlwH0lR9H9_iAothjfm4OURRTCt-z6MHfw&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=1&prompt=consent"

# Extract the code parameter
code_param = re.search(r"code=([^&]*)", encoded_url).group(1)

# Decode the URL-encoded code
decoded_code = unquote(code_param)
