import sys

path = r'\\wsl.localhost\Ubuntu\root\Projek\SPBE-kabtangerang\public\beranda.svg'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('fill="black"', 'fill="white"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
