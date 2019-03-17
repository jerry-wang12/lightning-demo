#!/usr/bin/python
# -*- coding:utf-8 -*-

import os
import json

resultDict = {}

# with open("configs/tsconfig.base.config", 'rw') as configFile:
#     configJson = json.loads(configFile.read())
#     print(configJson["paths"])

with open("static/package.json", 'r') as packageFile:
    packageJson = json.load(packageFile)
    for key in packageJson:
        resultDict[key] = [packageJson[key]]

    with open("static/lwc-components-lightning.json", 'r') as content:
        jsoncontent = json.loads(content.read())
        for temp in jsoncontent["children"]:
            if temp["name"] == 'src':
                lightningElements = temp["children"][0]
                break
        for item in lightningElements["children"]:
            moduleName = "lightning/" + item["name"]
            moduleUrl = "src/lightning/%s/%s.js" % (item["name"], item["name"])
            resultDict[moduleName] = [moduleUrl]


with open("configs/tsconfig.base.json", 'w') as configFile:
    configFile.write(json.dumps(resultDict))
