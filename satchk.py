#!/bin/env python3
import datetime

start_date = datetime.date(2025, 2, 27)
end_date = datetime.date(2026, 1, 18)
saturday_count = 0
current_date = start_date

while current_date <= end_date:
    if current_date.weekday() == 5: # Saturday is 5
        saturday_count += 1
    current_date += datetime.timedelta(days=1)

print(saturday_count)
