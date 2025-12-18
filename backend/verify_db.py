"""Verify database content."""
import sqlite3

conn = sqlite3.connect('tours.db')
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*) FROM tours')
count = cursor.fetchone()[0]
print(f'Tours in database: {count}')

cursor.execute('SELECT title, country, price FROM tours LIMIT 3')
print('\nSample tours:')
for row in cursor.fetchall():
    print(f'  - {row[0]} ({row[1]}) - ${row[2]}')

conn.close()
print('\n[OK] Database verification complete!')
