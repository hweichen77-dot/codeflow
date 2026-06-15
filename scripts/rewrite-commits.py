import re

def callback(commit, metadata):
    msg = commit.message.decode('utf-8', errors='replace')
    stripped = msg.strip()
    if stripped == 'File changes':
        commit.message = b'feat: add CodeFlow pages and component structure\n'
    elif 'api packages' in stripped.lower():
        commit.message = b'chore: update dependencies\n'
    elif stripped == 'Installed npm packages: remark-gfm@^4.0.0':
        commit.message = b'chore: install remark-gfm package\n'
