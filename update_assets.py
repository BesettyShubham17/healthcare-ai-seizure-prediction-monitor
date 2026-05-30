import streamlit as st
import base64
import os

def get_base64_of_bin_file(bin_file):
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

# Define new CSS to inject
# Note: We need to target the exact string to replace.
# The original CSS block in home_page starts around line 21.
# But I also need to update the BUTTON CSS which is further down around line 65.
# And I need to remove the `st.image` calls.

# Strategy: 
# 1. Update the MAIN background CSS (first st.markdown in home_page)
# 2. Update the BUTTON CSS (second st.markdown in home_page)
# 3. Remove the specific lines with st.image

new_main_css = f"""    <style>
    .main {{
        background-image: url("data:image/jpg;base64,{bg_b64}");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
    }}"""

# We'll use a regex or string replace for the .main CSS block.
# The original block:
#     .main {
#         background-image: url('https://www.sih.net/-/media/a48486f43f2244cca8f8998650fcf65b.ashx');
#         ...
#     }

import re

# 1. Replace Main Background CSS
# We look for the url(...) inside .main
pattern_bg = r"\.main\s*\{\s*background-image:\s*url\('[^']+'\);"
replacement_bg = f'.main {{\n        background-image: url("data:image/jpg;base64,{bg_b64}");'
content = re.sub(pattern_bg, replacement_bg, content)

# 2. Update Button CSS with Logos
# We will replace the entire "Custom CSS for Buttons" block we added earlier.
# Or better, we define specific classes for user/doctor buttons? 
# Streamlit buttons are hard to target individually without key order or nth-child.
# However, `col1` is first, `col2` is second.
# So `div[data-testid="column"]:nth-of-type(1) button` might work?
# Let's try targeting by the TYPE if possible, but they switch types.
# Best bet: Target the column divs.

new_button_css = f"""
    <style>
    /* Default Button Style (Secondary) -> Blue */
    div.stButton > button {{
        background-color: #0000FF !important;
        color: white !important;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        height: 60px; /* Fixed height for icon space */
        position: relative;
        padding-left: 50px; /* Space for icon */
        background-repeat: no-repeat;
        background-position: 10px center;
        background-size: 30px 30px;
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
    
    /* Specific Icons based on Column index (heuristic) */
    /* First button (User) - likely in first column or first button in this section */
    /* This is tricky in pure CSS without custom classes. */
    /* Streamlit structure: div.row-widget.stButton */
    
    /* We can use the 'aria-label' if we could set it, but we can't easily. */
    /* We will use the Button TEXT content? No CSS selector for text */

    /* HACK: Use nth-of-type on the buttons assuming they are the main buttons on the page */
    /* The buttons are in columns. */
    
    div[data-testid="column"]:nth-of-type(1) div.stButton > button {{
        background-image: url("data:image/png;base64,{user_b64}");
    }}
    
    div[data-testid="column"]:nth-of-type(2) div.stButton > button {{
        background-image: url("data:image/png;base64,{doctor_b64}");
    }}
    
    /* Centering images - REMOVE THIS since we are removing images */
    </style>
    """

# Replace the previous CSS block
start_marker = "# Custom CSS for Buttons"
end_marker = 'unsafe_allow_html=True)'
# We need to find the specific block.
# Let's just SEARCH for the previous CSS string "div.stButton > button"
# and replace the whole `st.markdown("""...""")` block? 
# Or just replace the content inside the <style> tag.

# Let's try to locate the start of the CSS block we added.
# It starts with `<style>\n    /* Default Button Style`
css_pattern = r"<style>\s*/\* Default Button Style.*?</style>"
# We need DOTALL
content = re.sub(css_pattern, new_button_css.strip().replace('<style>', '').replace('</style>', ''), content, flags=re.DOTALL)

# WAIT, the regex above replaces the CONTENT of style, but I provided the full tags in `new_button_css`.
# Let's fix `new_button_css` to NOT include <style> tags if I'm substituting inside.
# Actually, the previous `st.markdown` call structure:
# st.markdown("""
# <style>
# ...
# </style>
# """, unsafe_allow_html=True)

# Let's simple Replace the entire `st.markdown("""...""", unsafe_allow_html=True)` block?
# That's risky with regex spanning many lines.

# Let's use simple string replacement for the `background-image` part first (the main background).
# That part is done above.

# Now for the buttons.
# I will use a placeholder in `main.py` first? No.
# I will simply rewrite the `home_page` function's relevant part logic using string replace.

# Remove st.image lines
content = content.replace('st.image("user_icon.png", width=100)', '# Icon moved to CSS')
content = content.replace('st.image("doctor_icon.png", width=100)', '# Icon moved to CSS')

# Inject the new CSS.
# I'll look for `/* Default Button Style (Secondary) -> Blue */` and replace until `</style>`
css_start = "/* Default Button Style"
if css_start in content:
    # Find the end of the style block
    start_idx = content.find(css_start)
    end_idx = content.find("</style>", start_idx)
    
    if start_idx != -1 and end_idx != -1:
        # Construct the new CSS body (without tags)
        css_body = new_button_css.replace('<style>', '').replace('</style>', '').strip()
        
        # Replace
        content = content[:start_idx] + css_body + "\n    " + content[end_idx:]

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated main.py with Base64 assets.")
