import requests
import json
import math

q = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22%5ESPX%22%2C%22%5EVIX%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='

r = requests.get(q)
# print r.status_code
# print r.headers
# print r.content

data = json.loads(r.content)
quotes = data['query']['results']['quote']
# print quotes
for quote in quotes:
	print quote['symbol']
	print quote['LastTradePriceOnly']

	if quote['symbol'] == '^SPX':
		spx = float(quote['LastTradePriceOnly'])
	elif quote['symbol'] == '^VIX':
		vix = float(quote['LastTradePriceOnly'])

std_dev = spx * vix/100. * math.sqrt(7/252.0)
print "SPX is " + str(spx)
print "VIX is " + str(vix)
print "STD deviation is " + str(std_dev)
print "STD deviation / 2 is " + str(std_dev/2)
print "STD deviation / 4 is " + str(std_dev/4)

print "SPX + 1/2STD is " + str(spx + std_dev/2)
print "SPX - 1/2STD is " + str(spx - std_dev/2)