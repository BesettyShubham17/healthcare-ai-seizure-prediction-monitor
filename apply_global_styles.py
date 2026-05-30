import streamlit as st
import base64
import re
import os

def get_base64_of_bin_file(bin_file):
    if not os.path.exists(bin_file):
        print(f"Warning: File {bin_file} not found.")
        return ""
    with open(bin_file, 'rb') as f:
        data = f.read()
    return base64.b64encode(data).decode()

# Read main.py
with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Get Base64 strings
bg_b64 = get_base64_of_bin_file('background.jpg')
user_b64 = get_base64_of_bin_file('user_icon.png')
doctor_b64 = get_base64_of_bin_file('doctor_icon.png')

# 1. GLOBAL BACKGROUND UPDATE
# Current state of main.py might have the invalid C:\ path or old HTTPS url.
# We will use Regex to find `background-image: ...;` inside `.main` blocks.

# This regex matches: .main { [newlines/spaces] background-image: [CAPTURE_GROUP];
# We need to be careful.
# Let's try to replace the known chunks we saw in the file view.

# Chunk 1: Line 30 (approx)
# .main {
#         background-image: C:\Users\jagar\OneDrive\Documents\Major Project\Epileptic Seizure Prediction\EPILEPTIC PROJECT\background.jpg;
path_str = r"C:\Users\jagar\OneDrive\Documents\Major Project\Epileptic Seizure Prediction\EPILEPTIC PROJECT\background.jpg"
if path_str in content:
    content = content.replace(path_str, f'url("data:image/jpg;base64,{bg_b64}")')

# Chunk 2: The standard HTTPS url
old_https_url = "https://www.sih.net/-/media/a48486f43f2244cca8f8998650fcf65b.ashx"
if old_https_url in content:
    content = content.replace(old_https_url, f"data:image/jpg;base64,{bg_b64}")

# Chunk 3: Any other existing Base64 background if we ran this before?
# We want to catch url("data:...") or url('data:...')
if "data:image/jpg;base64" in content:
    # Use a regex that handles both single and double quotes
    pattern_b64 = r"url\(['\"]data:image/jpg;base64,[^'\"]+['\"]\)"
    new_b64_url = f'url("data:image/jpg;base64,{bg_b64}")'
    content = re.sub(pattern_b64, new_b64_url, content)


# 2. BUTTON LOGOS
# Remove st.image lines if they still exist
content = content.replace('st.image("user_icon.png", width=100)', '# Icon moved to CSS')
content = content.replace('st.image("doctor_icon.png", width=100)', '# Icon moved to CSS')

# Construct new Button CSS
# We target the specific CSS block we added earlier.
new_button_css = f"""
    <style>
    /* Default Button Style (Secondary) -> Blue */
    div.stButton > button {{
        background-color: #0000FF !important;
        color: white !important;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        height: 60px;
        position: relative;
        padding-left: 60px; /* Space for icon */
        background-repeat: no-repeat;
        background-position: 15px center; /* Icon position */
        background-size: 30px 30px; /* Icon size */
        text-align: left;
    }}
    div.stButton > button:hover {{
        background-color: #00008B !important;
    }}

    /* Primary Button Style (Active) -> Red */
    button[kind="primary"] {{
        background-color: #FF0000 !important;
        border: 2px solid #8B0000 !important;
    }}
    button[kind="primary"]:hover {{
        background-color: #CC0000 !important;
    }}
    
    /* User Button Icon (Column 1) */
    div[data-testid="column"]:nth-of-type(1) div.stButton > button {{
        background-image: url("data:image/png;base64,{user_b64}");
    }}
    
    /* Doctor Button Icon (Column 2) */
    div[data-testid="column"]:nth-of-type(2) div.stButton > button {{
        background-image: url("data:image/png;base64,{doctor_b64}");
    }}
    </style>
    """

# We look for the `st.markdown` block that contains the button styles.
# It starts with `/* Default Button Style` inside a style tag.
# If the file already has the NEW CSS structure (from a partial run), we replace it.
# If it has the OLD CSS structure (from Step 138), we replace that.

# Regex that matches the content of the markdown call: `st.markdown(""" ... """, unsafe_allow_html=True)`
# We'll search for the inner content starting with `<style>.../* Default Button Style`
# and ending with `</style>..."""`

# Simpler: Search for the unique comment `/* Default Button Style (Secondary) -> Blue */`
# and replace the whole block surrounding it.

# Let's try to match the `st.markdown("""<style>.../* Default Button Style ... </style>""", unsafe_allow_html=True)`
# This covers both old and new versions if they share that header.
style_regex = r'st\.markdown\("""\s*<style>\s*/\* Default Button Style.*?</style>\s*""", unsafe_allow_html=True\)'
replacement = f'st.markdown("""{new_button_css}""", unsafe_allow_html=True)'

content = re.sub(style_regex, replacement, content, flags=re.DOTALL)

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated main.py")
