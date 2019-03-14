#!/usr/bin/python
# -*- coding:utf-8 -*-

import json
with open("../static/labels.json", 'r') as f:
  temp = json.loads(f.read())
  print(temp)
  print(temp['rule'])
  print(temp['rule']['namespace'])