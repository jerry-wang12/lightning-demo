#!/usr/bin/python
# -*- coding:utf-8 -*-

import os
import json

needConvertDirs = ("external", "src", "labels")


def mkdir(path):
    isExists = os.path.exists(path)
    if not isExists:
        os.makedirs(path)
        print("创建目录 %s 成功" % path)
        return True
    else:
        print("目录 %s 已存在" % path)
        return False


def createAndWriteFile(filePath, fileContent):
    fp = open(filePath, "w")
    fp.write(fileContent)
    fp.close()


def createDirOrFile(item, parentDir="."):
    if("children" in item.keys()):
        relativeDir = parentDir + "/" + item["name"]
        mkdir(relativeDir)
        for childItem in item["children"]:
            createDirOrFile(childItem, relativeDir)
    else:
        createAndWriteFile(parentDir + "/" +
                           item["name"], item["content"])


with open("static/lwc-components-lightning.json", 'r') as f:
    jsoncontent = json.loads(f.read())
    for item in jsoncontent["children"]:
        if(item["name"] in needConvertDirs):
            createDirOrFile(item)
